export type SearchRecordsRequest = {
  textSearch?: string;
};

export type ProcurementRecord = {
  id: string;
  stage: string;
  title: string;
  description: string;
  publishDate: string;
  closeDate: string;
  awardDate: string;
  value:number;
  currency:string;
  buyer: {
    id: string;
    name: string;
  };
};

export type SearchRecordsResponse = {
  records: ProcurementRecord[];
};

class Api {
  async searchRecords(
    request: SearchRecordsRequest
  ): Promise<SearchRecordsResponse> {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  }
}

export default Api;
