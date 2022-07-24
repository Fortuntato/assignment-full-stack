import express from "express";

import { Sequelize } from "sequelize-typescript";
import {
  ProcurementRecordDto,
  RecordSearchRequest,
  RecordSearchResponse,
} from "./api_types";
import { Buyer } from "./db/Buyer";
import { ProcurementRecord } from "./db/ProcurementRecord";

/**
 * This file has little structure and doesn't represent production quality code.
 * Feel free to refactor it or add comments on what could be improved.
 *
 * We specifically avoided any use of sequelize ORM features and used plain SQL
 * queries and only the data mapping to get nice JavaScript objects from the DB.
 *
 * You can switch to using the ORM features or continue using SQL.
 */

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env["SQLITE_DB"] || "./db.sqlite3",
});

sequelize.addModels([Buyer, ProcurementRecord]);

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "ejs");

app.locals["assets_url"] = process.env.VITE_URL || "http://localhost:3001";

app.get("/", (_req, res) => {
  res.render("index.html.ejs");
});

app.use(express.json());

type RecordSearchFilters = {
  textSearch?: string;
};

/**
 * Queries the database for procurement records according to the search filters.
 */
async function searchRecords({
  textSearch,
}: RecordSearchFilters): Promise<ProcurementRecord[]> {
  if (textSearch) {
    return await sequelize.query(
      "SELECT * FROM procurement_records WHERE title LIKE :textSearch OR description LIKE :textSearch",
      {
        model: ProcurementRecord, // by setting this sequelize will return a list of ProcurementRecord objects
        replacements: {
          textSearch: `%${textSearch}%`,
        },
      }
    );
  } else {
    return await sequelize.query("SELECT * FROM procurement_records", {
      model: ProcurementRecord,
    });
  }
}

/**
 * Converts a DB-style ProcurementRecord object to an API type.
 * Assumes that all related objects (buyers) are prefetched upfront and passed in the `buyersById` map
 */
function serializeProcurementRecord(
  record: ProcurementRecord,
  buyersById: Map<string, Buyer>
): ProcurementRecordDto {
  const buyer = buyersById.get(record.buyer_id);
  if (!buyer) {
    throw new Error(
      `Buyer ${record.buyer_id} was not pre-fetched when loading record ${record.id}.`
    );
  }

  return {
    id: record.id,
    stage: record.stage,
    title: record.title,
    description: record.description,
    currency: record.currency,
    value: record.value,
    publishDate: record.publish_date,
    closeDate: record.close_date,
    awardDate: record.award_date,
    buyer: {
      id: buyer.id,
      name: buyer.name,
    },
  };
}

function unique<T>(items: Iterable<T>): T[] {
  return Array.from(new Set(items));
}

/**
 * Converts an array of DB-style procurement record object into API types.
 * Prefetches all the required relations.
 */
async function serializeProcurementRecords(
  records: ProcurementRecord[]
): Promise<ProcurementRecordDto[]> {
  // Get unique buyer ids for the selected records
  const buyerIds = unique(records.map((pr) => pr.buyer_id));

  // Fetch the buyer data in one query
  const buyers = await sequelize.query(
    "SELECT * FROM buyers WHERE id IN (:buyerIds)",
    {
      model: Buyer,
      replacements: {
        buyerIds,
      },
    }
  );

  const buyersById = new Map(buyers.map((b) => [b.id, b]));
  return records.map((r) => serializeProcurementRecord(r, buyersById));
}

app.post("/api/records", async (req, res) => {
  const requestPayload = req.body as RecordSearchRequest;

  const records = await searchRecords({
    textSearch: requestPayload.textSearch,
  });

  const response: RecordSearchResponse = {
    records: await serializeProcurementRecords(records),
  };

  res.json(response);
});

app.listen(app.get("port"), () => {
  console.log("  App is running at http://localhost:%d", app.get("port"));
  console.log("  Press CTRL-C to stop\n");
});
