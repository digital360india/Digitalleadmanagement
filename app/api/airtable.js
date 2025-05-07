import Airtable from "airtable";
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});
export const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
// export const baseRe = Airtable.base("appcfoMmiwc3BmOLp");
// export const enForm = base("counsellorForm");
// export const inForm = base("inquiryForm");
// export const table = base("Sheet2");
