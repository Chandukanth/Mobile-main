// Product Weight Unit Options
export const weightUnitOptions = [
    {
      value: "g",
      label: "g",
    },
    {
      value: "lb",
      label: "lb",
    },
    {
      value: "oz",
      label: "oz",
    },
    {
      value: "kg",
      label: "kg",
    },
    {
      value: "l",
      label: "l",
    },
    {
      value: "ml",
      label: "ml",
    },
    {
      value: "inch",
      label: "inch",
    },
    {
      value: "pcs",
      label: "pcs",
    },
    {
      value: "coils",
      label: "coils",
    },
];

export const statusOptions = [
  {
    label : "Active",
    value : 1
  },
  {
    label : "Archived",
    value : 2
  },
  {
    label :"Draft",
    value: 0
    }
]

export const StatusText = (data) => {
  if(data == "Draft"){
    return 0
  }
  if(data == "Active"){
    return 1
  }
    if(data == "Archived"){
      return 2
    }
  }

  export const Status = {
    DRAFT :  "Draft",
    ACTIVE : 'Active',
    ARCHIVED : 'Archived'
  }
