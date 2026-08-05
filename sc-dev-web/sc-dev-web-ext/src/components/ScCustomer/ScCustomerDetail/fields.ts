export type FIELD_TYPE = {
  category: string;
  fields: FIELD_ITEM_TYPE[];
}

export type FIELD_ITEM_TYPE = {
  label: string;
  key: string;
  type?: string;
}

export const Fields: FIELD_TYPE[] = [
  {
    category: 'Key Information',
    fields: [
      {
        label: 'Full Name',
        key: 'customer.fullName',
      }, {
        label: 'Middle Name',
        key: 'customer.midName',
      }, {
        label: 'Last Name',
        key: 'customer.lName',
      }, {
        label: 'Customer Type',
        key: 'customer.profileType',
      }, {
        label: 'Customer Segment',
        key: 'customer.segmentCode',
      }, {
        label: 'Status',
        key: 'customer.relationshipStatus',
      },
    ],
  }, {
    category: 'Personal Information',
    fields: [
      {
        label: 'Date Of Birth',
        key: 'customer.dob',
        type: 'date',
      },
      {
        label: 'Country Of Residence',
        key: 'customer.residentCountry',
      },
    ],
  }, {
    category: 'Relationship Information',
    fields: [
      {
        label: 'ARM Code',
        key: 'customer.armCode',
      },
      {
        label: 'Relationship Status',
        key: 'customer.relationshipStatus',
      }, {
        label: 'Activation Date',
        key: 'customer.profileActivationDate',
        type: 'date',
      },
    ],
  },
];