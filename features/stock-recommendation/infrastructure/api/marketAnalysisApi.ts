import type {
  MarketAnalysisRequest,
  MarketAnalysisResponse,
} from "@/features/stock-recommendation/domain/model/marketAnalysis";
import { agentHttpClient as httpClient } from "@/infrastructure/http/agentHttpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";

export async function askMarketAnalysis(
  request: MarketAnalysisRequest
): Promise<MarketAnalysisResponse> {
  const res = await httpClient<ApiResponse<MarketAnalysisResponse>>(
    "/api/v1/market-analysis/ask",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
  return res.data;
}
