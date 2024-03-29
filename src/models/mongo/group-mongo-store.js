import { Group } from "./group.js";
import { lighthouseMongoStore } from "./lighthouse-mongo-store.js";

export const groupMongoStore = {
  async getAllGroups() {
    const groups = await Group.find().lean();
    return groups;
  },

  async getGroupById(id) {
    if (id) {
      const group = await Group.findOne({ _id: id }).lean();
      if (group) {
        group.lighthouses = await lighthouseMongoStore.getLighthousesByGroupId(group._id);
      }
      return group;
    }
    return null;
  },

  async addGroup(group) {
    const newGroup = new Group(group);
    const groupObj = await newGroup.save();
    return this.getGroupById(groupObj._id);
  },

  async getUserGroups(id) {
    const group = await Group.find({ userid: id }).lean();
    return group;
  },

  async deleteGroupById(id) {
    try {
      await Group.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllGroups() {
    await Group.deleteMany({});
  }
};