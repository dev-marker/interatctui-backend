import cosineSimilarity from "compute-cosine-similarity";
import dot from "compute-dot";

const computeSimilarity = (x: number[], y: number[]): number => {
  if (process.env.SIMILARITY_MESURE === "cosine") {
    return cosineSimilarity(x, y);
  } else if (process.env.SIMILARITY_MESURE === "dot") {
    return dot(x, y);
  }

  throw new Error(
    `Unknown similarity measure: ${process.env.SIMILARITY_MESURE}`
  );
};

export default computeSimilarity;
