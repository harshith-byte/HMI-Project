// test-data.ts

export const data = {
  title: "Construction Trends (2023-2025)",
  description: "Real and nominal changes in Germany's construction industry",

  // Construction Dataset
  dataset: [
    {
      label: "Total Construction",
      values: [
        { year: "2023", percent: -1.1 },
        { year: "2024", percent: -1.5 },
        { year: "2025", percent: 1.5 },
      ],
    },
    {
      label: "Residential Construction",
      values: [
        { year: "2023", percent: -2.3 },
        { year: "2024", percent: -3.4 },
        { year: "2025", percent: 0.4 },
      ],
    },
    {
      label: "Civil Engineering",
      values: [
        { year: "2023", percent: 2.6 },
        { year: "2024", percent: 3.6 },
        { year: "2025", percent: 3.3 },
      ],
    },
  ],

  // Gender Diversity Data
  data: {
    summary: {
      percent_of_executive_board_members_who_are_women: {
        late_fall_2023: 18,
        trending: "up",
      },
      companies_with_at_least_one_woman_on_executive_board: {
        count: 110,
        trending: "up",
      },
      women_CEOs: {
        count: 9,
        trending: "down",
      },
    },
    companies_by_number_of_women_on_executive_board: {
      2021: {
        0: 50,
        1: 40,
        2: 5,
        3: 4,
        4: 1,
        5: 0,
        6: 0,
      },
      2022: {
        0: 45,
        1: 39,
        2: 10,
        3: 4,
        4: 2,
        5: 0,
        6: 0,
      },
      2023: {
        0: 30,
        1: 45,
        2: 15,
        3: 7,
        4: 3,
        5: 0,
        6: 0,
      },
    },
  },
};
