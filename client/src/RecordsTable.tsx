import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React from "react";
import { ProcurementRecord } from "./Api";
import ProcurementRecordPreviewModal from "./ProcurementRecordPreview";

type Props = {
  records: ProcurementRecord[];
};

function RecordsTable(props: Props) {
  const { records } = props;

  // Creating the list of buyer filters by mapping the buyers name to text and value.
  const filterOptions: any[]  = [];
  for (let i = 0; i < records.length - 1 ; i++) {

    // Check if it's a duplicate case
    if(filterOptions.findIndex(x=>x.value === records[i].buyer.name) < 0)
      filterOptions.push({text: records[i].buyer.name, value: records[i].buyer.name});
  }

  const [previewedRecord, setPreviewedRecord] = React.useState<
    ProcurementRecord | undefined
  >();

  const columns = React.useMemo<ColumnType<ProcurementRecord>[]>(() => {
    return [
      {
        title: "Published",
        render: (record: ProcurementRecord) =>
          new Date(record.publishDate).toLocaleDateString(),
      },
      {
        title: "Title",
        render: (record: ProcurementRecord) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setPreviewedRecord(record);
          };
          return (
            <a href="#" onClick={handleClick}>
              {record.title}
            </a>
          );
        },
      },
      {
        title: "Value",
        render: (record: ProcurementRecord) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setPreviewedRecord(record);
          };
          return (
            <a href="#" onClick={handleClick}>
              {record.currency} {record.value}
            </a>
          );
        },
      },
      {
        title: "Buyer name",
        render: (record: ProcurementRecord) => record.buyer.name,
        filters: filterOptions, // Select distinct element by the value 
        onFilter: (value: string, record) => record.buyer.name.startsWith(value),
        filterSearch: true
      },
      {
        title: "Stage",
        render: (record: ProcurementRecord) => 
          record.stage == "TENDER" || record.stage == "TenderIntent" 
            ? record.closeDate == null || new Date(record.closeDate).toLocaleDateString() == "INVALID DATE"
              ? "Open until {close_date}" // Would change the string to be: "Open (No close date available)" for a better user feedback. (SC 24/07/2022)
              : new Date(record.closeDate) > new Date() 
                ? "Open until " + new Date(record.closeDate).toLocaleDateString()
                : "Closed"
            : record.stage == "CONTRACT"
              ? "Awarded on " + new Date(record.awardDate).toLocaleDateString()
              : ""
      }
    ];
  }, []);
  return (
    <>
      <Table columns={columns} dataSource={records} pagination={false} />
      <ProcurementRecordPreviewModal
        record={previewedRecord}
        onClose={() => setPreviewedRecord(undefined)}
      />
    </>
  );
}

export default RecordsTable;
