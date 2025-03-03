import { QdrantVectorStore } from "@llamaindex/qdrant";
import * as dotenv from "dotenv";
import {
  Document,
  MetadataMode,
  NodeWithScore,
  Settings,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";

// Update callback manager
Settings.callbackManager.on("retrieve-end", (event) => {
  const { nodes } = event.detail;
  console.log(
    "The retrieved nodes are:",
    nodes.map((node: NodeWithScore) => node.node.getContent(MetadataMode.NONE)),
  );
});

// Load environment variables from local .env file
dotenv.config();

const collectionName = "dog_colors";
const qdrantUrl = "http://127.0.0.1:6333";

async function main() {
  try {
    const docs = [
      new Document({
        text: "The dog is brown",
        metadata: {
          dogId: "1",
        },
      }),
      new Document({
        text: "The dog is red",
        metadata: {
          dogId: "2",
        },
      }),
      new Document({
        text: "The dog is black",
        metadata: {
          dogId: "3",
        },
      }),
    ];
    console.log("Creating QdrantDB vector store");
    const qdrantVs = new QdrantVectorStore({ url: qdrantUrl, collectionName });
    const ctx = await storageContextFromDefaults({ vectorStore: qdrantVs });

    console.log("Embedding documents and adding to index");
    const index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: ctx,
    });

    console.log(
      "Querying index with no filters: Expected output: Brown probably",
    );
    const queryEngineNoFilters = index.asQueryEngine();
    const noFilterResponse = await queryEngineNoFilters.query({
      query: "What is the color of the dog?",
    });
    console.log("No filter response:", noFilterResponse.toString());
    console.log("Querying index with dogId 2: Expected output: Red");
    const queryEngineDogId2 = index.asQueryEngine({
      preFilters: {
        filters: [
          {
            key: "dogId",
            value: "2",
            operator: "==",
          },
        ],
      },
    });
    const response = await queryEngineDogId2.query({
      query: "What is the color of the dog?",
    });
    console.log("Filter with dogId 2 response:", response.toString());

    console.log("Querying index with dogId !=2: Expected output: Not red");
    const queryEngineNotDogId2 = index.asQueryEngine({
      preFilters: {
        filters: [
          {
            key: "dogId",
            value: "2",
            operator: "!=",
          },
        ],
      },
    });
    const responseNotDogId2 = await queryEngineNotDogId2.query({
      query: "What is the color of the dog?",
    });
    console.log(responseNotDogId2.toString());

    console.log(
      "Querying index with dogId 2 or 3: Expected output: Red, Black",
    );
    const queryEngineIn = index.asQueryEngine({
      preFilters: {
        filters: [
          {
            key: "dogId",
            value: ["2", "3"],
            operator: "in",
          },
        ],
      },
    });
    const responseIn = await queryEngineIn.query({
      query: "List all dogs",
    });
    console.log(responseIn.toString());
  } catch (e) {
    console.error(e);
  }
}

void main();
