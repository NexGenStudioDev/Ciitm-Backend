import Notice from './notice.model.mjs';

class Notice_Service {
  create_Notice = async (data) => {
    let { title, content, doc_link, type } = data;
    let Created_Notice = await Notice.create({
      title,
      content,
      doc_link,
      type,
    });

    if (!Created_Notice) {
      throw new Error('Failed to create notice');
    }

    return Created_Notice;
  };

  delete_Notice = async (id) => {
    let deletedNotice = await Notice.findByIdAndDelete(id);
    if (!deletedNotice) {
      throw new Error('Notice not found or already deleted');
    }
    return deletedNotice;
  };
}

export default new Notice_Service();
