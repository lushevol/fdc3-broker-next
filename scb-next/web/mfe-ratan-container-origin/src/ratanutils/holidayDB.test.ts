import { InitIndexedDB } from './holidayDB';
const waitForTime = (time = 200) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});
test('InitIndexedDB', async () => {
  const x = new InitIndexedDB({
    dbName: "x",
    storeName: "x",
    version: 2,
  });
  await waitForTime();
  const holidayDB = new InitIndexedDB({
    dbName: "holidays",
    storeName: "holidayStore",
    clearOnClose: true,
  });
  await waitForTime();
  await holidayDB.add("val1", "key1");
  await holidayDB.add("val2", "key2");
  const val1 = await holidayDB.get("key1");
  expect(val1).toEqual("val1");
  const val2 = await holidayDB.get("key2");
  expect(val2).toEqual("val2");
  try {
    await holidayDB.add("val3", "key1");
  } catch (e) {
    // console.info(e.target._error)
  }
  try {
    const val3 = await holidayDB.get("key3");
  } catch (e) {
    //console.info(e.target._error)
  }
  holidayDB.clear();
  // @ts-ignore
  window.onunload();
});
