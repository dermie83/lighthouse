import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { lighthouseService } from "./lighthouse-service.js";
import { maggie, testGroups, testLighthouses, lighthouse1, group1 } from "../fixtures.js";
import { db } from "../../src/models/db.js";

suite("Lighthouse API tests", () => {
  let user = null;
  let newGroup = null;


  setup(async () => {
    db.init("mongo");
    await lighthouseService.deleteAllGroups();
    await lighthouseService.deleteAllUsers();
    await lighthouseService.deleteAllLighthouses();
    user = await lighthouseService.createUser(maggie);
    group1.userid = user._id;
    newGroup = await lighthouseService.createGroup(group1);
  });

  teardown(async () => {});

  test("create a lighthouse", async () => {
    const returnedLighthouse = await lighthouseService.createLighthouse(newGroup._id, lighthouse1);
    assert.isNotNull(returnedLighthouse);
    assertSubset(lighthouse1, returnedLighthouse);
  });

  test("create Multiple lighthouseApi", async () => {
    for (let i = 0; i < testLighthouses.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await lighthouseService.createLighthouse(newGroup._id, testLighthouses[i]);
    }
    const returnedLighthouses = await lighthouseService.getAllLighthouses();
    assert.equal(returnedLighthouses.length, testLighthouses.length);
    for (let i = 0; i < returnedLighthouses.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const lighthouse = await lighthouseService.getLighthouse(returnedLighthouses[i]._id);
      assertSubset(lighthouse, returnedLighthouses[i]);
    }
  });

  test("Delete Lighthouse", async () => {
    for (let i = 0; i < testLighthouses.length; i += 1) {
      // create a new group with multiple lighthouses

      // eslint-disable-next-line no-await-in-loop
      await lighthouseService.createLighthouse(newGroup._id, testLighthouses[i]);
    }
    let returnedLighthouses = await lighthouseService.getAllLighthouses();
    assert.equal(returnedLighthouses.length, testLighthouses.length);
    for (let i = 0; i < returnedLighthouses.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const lighthouse = await lighthouseService.deleteLighthouse(returnedLighthouses[i]._id);
    }
    returnedLighthouses = await lighthouseService.getAllLighthouses();
    assert.equal(returnedLighthouses.length, 0);
  });

  test("test denormalised groups", async () => {
    for (let i = 0; i < testLighthouses.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await lighthouseService.createLighthouse(newGroup._id, testLighthouses[i]);
    }
    const returnedGroup = await lighthouseService.getGroup(newGroup._id);
    assert.equal(returnedGroup.lighthouses.length, testLighthouses.length);
    for (let i = 0; i < testLighthouses.length; i += 1) {
      assertSubset(testLighthouses[i], returnedGroup.lighthouses[i]);
    }
  });
});