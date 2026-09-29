import amqp from 'amqplib';
import { EventEmitter } from 'events';

class RabbitMQService extends EventEmitter {
  constructor() {
    super();
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.inMemoryQueues = new Map();
    this.stats = {
      connected: false,
      mode: 'in-memory',
      messagesPublished: 0,
      messagesProcessed: 0,
      messagesFailed: 0,
      activeQueues: [
        'admissions_queue',
        'notifications_queue',
        'email_queue',
        'payments_queue',
        'audit_queue',
      ],
    };

    // Initialize in-memory queues
    for (const q of this.stats.activeQueues) {
      this.inMemoryQueues.set(q, []);
    }
  }

  async connect() {
    if (this.isConnected || this.isConnecting) return;
    this.isConnecting = true;

    const url = process.env.RABBITMQ_URL || process.env.AMQP_URL;

    if (!url) {
      console.log('ℹ️ RABBITMQ_URL not provided. Using in-memory fallback message queue.');
      this.stats.mode = 'in-memory (standalone)';
      this.isConnecting = false;
      return;
    }

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      this.stats.connected = true;
      this.stats.mode = 'amqp-live';

      // Assert common queues
      for (const queue of this.stats.activeQueues) {
        await this.channel.assertQueue(queue, { durable: true });
      }

      console.log('✅ Connected to RabbitMQ successfully');

      this.connection.on('error', (err) => {
        console.warn('⚠️ RabbitMQ connection error:', err.message);
        this.isConnected = false;
        this.stats.connected = false;
        this.stats.mode = 'in-memory (fallback)';
      });

      this.connection.on('close', () => {
        console.warn('⚠️ RabbitMQ connection closed. Switching to in-memory queue fallback.');
        this.isConnected = false;
        this.stats.connected = false;
        this.stats.mode = 'in-memory (fallback)';
      });
    } catch (error) {
      console.warn('⚠️ RabbitMQ server unavailable (' + error.message + '). Active fallback in-memory message queue initialized.');
      this.isConnected = false;
      this.stats.connected = false;
      this.stats.mode = 'in-memory (fallback)';
    } finally {
      this.isConnecting = false;
    }
  }

  async publish(queueName, message, options = {}) {
    const enrichedMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      timestamp: new Date().toISOString(),
      queue: queueName,
      data: typeof message === 'string' ? JSON.parse(message || '{}') : message,
    };

    this.stats.messagesPublished++;

    if (this.isConnected && this.channel) {
      try {
        await this.channel.assertQueue(queueName, { durable: true });
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(enrichedMessage)), {
          persistent: true,
          ...options,
        });
        return { success: true, mode: 'rabbitmq', messageId: enrichedMessage.id };
      } catch (err) {
        console.warn('RabbitMQ publish error, falling back to in-memory queue:', err.message);
      }
    }

    // In-memory fallback
    if (!this.inMemoryQueues.has(queueName)) {
      this.inMemoryQueues.set(queueName, []);
    }
    this.inMemoryQueues.get(queueName).push(enrichedMessage);
    this.emit('message:' + queueName, enrichedMessage);

    return { success: true, mode: 'in-memory', messageId: enrichedMessage.id };
  }

  async consume(queueName, handler) {
    if (this.isConnected && this.channel) {
      try {
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.consume(queueName, async (msg) => {
          if (msg !== null) {
            try {
              const content = JSON.parse(msg.content.toString());
              await handler(content);
              this.channel.ack(msg);
              this.stats.messagesProcessed++;
            } catch (err) {
              console.error('Error processing RabbitMQ message:', err);
              this.channel.nack(msg, false, true);
              this.stats.messagesFailed++;
            }
          }
        });
      } catch (err) {
        console.warn('Failed to register RabbitMQ consumer, using in-memory listener:', err.message);
      }
    }

    // Also register in-memory listener for standalone/fallback mode
    this.on('message:' + queueName, async (msg) => {
      try {
        await handler(msg);
        this.stats.messagesProcessed++;
      } catch (err) {
        console.error('Error in in-memory message handler:', err);
        this.stats.messagesFailed++;
      }
    });
  }

  getStats() {
    const queueDepths = {};
    for (const [name, msgs] of this.inMemoryQueues.entries()) {
      queueDepths[name] = msgs.length;
    }
    return {
      ...this.stats,
      inMemoryQueueDepths: queueDepths,
      timestamp: new Date().toISOString(),
    };
  }
}

const rabbitMQService = new RabbitMQService();
export default rabbitMQService;
