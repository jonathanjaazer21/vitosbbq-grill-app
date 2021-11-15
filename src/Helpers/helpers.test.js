import { producedProductListOfAllCodes } from "./collectionData"

test("produce product list of all codes", () => {
  expect(
    producedProductListOfAllCodes([
      {
        groupHeader: "test1",
        productList: [
          {
            code: "test1code1",
            price: 20,
          },
          {
            code: "test1code2",
            price: 20,
          },
          {
            code: "test1code3",
            price: 20,
          },
        ],
      },
      {
        groupHeader: "test2",
        productList: [
          {
            code: "test2code1",
            price: 20,
          },
          {
            code: "test2code2",
            price: 20,
          },
          {
            code: "test2code3",
            price: 20,
          },
        ],
      },
      {
        groupHeader: "test3",
        productList: [
          {
            code: "test3code1",
            price: 20,
          },
          {
            code: "test3code2",
            price: 20,
          },
          {
            code: "test3code3",
            price: 20,
          },
        ],
      },
    ])
  ).toStrictEqual([
    "test1code1",
    "test1code2",
    "test1code3",
    "test2code1",
    "test2code2",
    "test2code3",
    "test3code1",
    "test3code2",
    "test3code3",
  ])
})
