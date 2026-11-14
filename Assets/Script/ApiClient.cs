
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

// These classes match the API contract exactly.
[Serializable]
public class EstimateRequest
{
    public string houseType;
    public string wall;
    public string roof;
    public string state;
}

[Serializable]
public class StageCosts
{
    public int foundation, walls, roof, finishing;
}

[Serializable]
public class EstimateResponse
{
    public string houseType;
    public int areaSqFt;
    public int total;
    public StageCosts stages;
    public bool offline;
}

public class ApiClient : MonoBehaviour
{
    public string baseUrl = "http://192.168.1.4:3000";

    public void GetEstimate(EstimateRequest req, Action<EstimateResponse> onDone)
    {
        StartCoroutine(PostEstimate(req, onDone));
    }

    IEnumerator PostEstimate(EstimateRequest req, Action<EstimateResponse> onDone)
    {
        EstimateResponse result = null;
        string json = JsonUtility.ToJson(req);

        using (UnityWebRequest www = new UnityWebRequest(baseUrl + "/api/estimate", "POST"))
        {
            www.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(json));
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            www.timeout = 5;

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    result = JsonUtility.FromJson<EstimateResponse>(www.downloadHandler.text);

                    if (result != null)
                        result.offline = false;
                }
                catch (Exception)
                {
                    result = null;
                }
            }
            else
            {
                Debug.LogWarning("API failed, using offline estimate: " + www.error);
            }
        }

        if (result == null || result.stages == null)
            result = OfflineEstimate(req);

        onDone?.Invoke(result);
    }

    // Same formula as the backend, with hardcoded values.
    EstimateResponse OfflineEstimate(EstimateRequest r)
    {
        int area = r.houseType == "2BHK" ? 450 : 270;

        float rate = 1200f;

        if (r.state == "Madhya Pradesh")
            rate = 1150f;
        else if (r.state == "Odisha")
            rate = 1100f;

        float wall = 1.0f;

        if (r.wall == "flyash")
            wall = 0.9f;
        else if (r.wall == "block")
            wall = 1.1f;

        float roof = r.roof == "tin" ? 0.7f : 1.0f;

        int total = Mathf.RoundToInt(area * rate * wall * roof);

        int f = total * 20 / 100;
        int w = total * 35 / 100;
        int ro = total * 25 / 100;

        return new EstimateResponse
        {
            houseType = r.houseType,
            areaSqFt = area,
            total = total,
            stages = new StageCosts
            {
                foundation = f,
                walls = w,
                roof = ro,
                finishing = total - f - w - ro
            },
            offline = true
        };
    }
}
