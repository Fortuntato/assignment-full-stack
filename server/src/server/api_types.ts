export type RecordSearchRequest = {
  textSearch?: string;
};

export type BuyerDto = {
  id: string;
  name: string;
};

export type ProcurementRecordDto = {
  id: string;
  stage:string;
  title: string;
  description: string;
  buyer: BuyerDto;
  publishDate: string;
  closeDate: string;
  awardDate: string;
  currency: string;
  value: number;
};

export type RecordSearchResponse = {
  records: ProcurementRecordDto[];
};
