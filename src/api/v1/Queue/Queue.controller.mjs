import rabbitMQService from '../../../service/rabbitmq.service.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';

const QueueController = {
  async getStatus(req, res) {
    try {
      const stats = rabbitMQService.getStats();
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Queue status retrieved successfully',
        stats
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to retrieve queue status'
      );
    }
  },

  async publishMessage(req, res) {
    try {
      const { queue, message, payload } = req.body;

      if (!queue) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          'Field "queue" is required'
        );
      }

      const messageContent = payload || message;
      if (!messageContent) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          'Field "message" or "payload" is required'
        );
      }

      const result = await rabbitMQService.publish(queue, messageContent);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        `Message queued to ${queue} (${result.mode})`,
        result
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to publish message to queue'
      );
    }
  },

  async getQueues(req, res) {
    try {
      const queues = [
        {
          name: 'admissions_queue',
          purpose: 'New student application and enrollment events',
          durable: true,
        },
        {
          name: 'notifications_queue',
          purpose: 'System notices and student/faculty alerts',
          durable: true,
        },
        {
          name: 'email_queue',
          purpose: 'Asynchronous transactional emails and OTP dispatch',
          durable: true,
        },
        {
          name: 'payments_queue',
          purpose: 'Student tuition fees and receipt generation events',
          durable: true,
        },
        {
          name: 'audit_queue',
          purpose: 'Administrative actions, security logs, and role changes',
          durable: true,
        },
      ];

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Active queues listed successfully',
        { queues, total: queues.length }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  },
};

export default QueueController;
