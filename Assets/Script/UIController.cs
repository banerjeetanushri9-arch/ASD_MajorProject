
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UIController : MonoBehaviour
{
    [Header("Dropdowns")]
    public TMP_Dropdown houseDropdown;
    public TMP_Dropdown wallDropdown;
    public TMP_Dropdown roofDropdown;
    public TMP_Dropdown stateDropdown;

    [Header("Text Elements")]
    public TMP_Text totalText;
    public TMP_Text stageText;
    public TMP_Text stageNameText;

    [Header("Stage Slider")]
    public Slider stageSlider;

    [Header("House Scripts")]
    public HouseVisualizer houseVisualizer;
    public StageController stageController;
    public ApiClient apiClient;

    void Start()
    {
        // Check that all required references are assigned.
        if (houseDropdown == null || wallDropdown == null ||
            roofDropdown == null || stateDropdown == null ||
            totalText == null || stageText == null ||
            stageNameText == null || stageSlider == null ||
            houseVisualizer == null || stageController == null ||
            apiClient == null)
        {
            Debug.LogError("UIController: One or more Inspector references are missing!");
            return;
        }

        // Clear old dropdown options first.
        houseDropdown.ClearOptions();
        wallDropdown.ClearOptions();
        roofDropdown.ClearOptions();
        stateDropdown.ClearOptions();

        // Add house types.
        houseDropdown.AddOptions(new List<string>
        {
            "1BHK", "2BHK"
        });

        // Add wall materials.
        wallDropdown.AddOptions(new List<string>
        {
            "Brick", "Fly Ash", "Block"
        });

        // Add roof materials.
        roofDropdown.AddOptions(new List<string>
        {
            "RCC", "Tin"
        });

        // Add states.
        stateDropdown.AddOptions(new List<string>
        {
            "Chhattisgarh",
            "Madhya Pradesh",
            "Odisha"
        });

        // Refresh dropdown display.
        houseDropdown.RefreshShownValue();
        wallDropdown.RefreshShownValue();
        roofDropdown.RefreshShownValue();
        stateDropdown.RefreshShownValue();

        // Listen for dropdown and slider changes.
        houseDropdown.onValueChanged.AddListener(OnHouseChanged);
        wallDropdown.onValueChanged.AddListener(OnWallChanged);
        roofDropdown.onValueChanged.AddListener(OnRoofChanged);
        stageSlider.onValueChanged.AddListener(OnStageChanged);

        ApplyInitialSettings();
    }

    void ApplyInitialSettings()
    {
        houseDropdown.value = 0;
        wallDropdown.value = 0;
        roofDropdown.value = 0;
        stateDropdown.value = 0;

        houseVisualizer.ApplyHouseType(0);
        houseVisualizer.ApplyWall(0);
        houseVisualizer.ApplyRoof(0);

        stageSlider.minValue = 1;
        stageSlider.maxValue = 4;
        stageSlider.wholeNumbers = true;
        stageSlider.value = 1;

        stageController.SetStage(1);
        stageNameText.text = "Foundation";

        totalText.text = "Total Cost: Not calculated";
        stageText.text = "Construction Costs";
    }

    void OnHouseChanged(int index)
    {
        houseVisualizer.ApplyHouseType(index);
    }

    void OnWallChanged(int index)
    {
        houseVisualizer.ApplyWall(index);
    }

    void OnRoofChanged(int index)
    {
        houseVisualizer.ApplyRoof(index);
    }

    void OnStageChanged(float value)
    {
        int stage = Mathf.Clamp(
            Mathf.RoundToInt(value), 1, 4
        );

        stageController.SetStage(stage);

        string[] names =
        {
            "Foundation",
            "Walls",
            "Roof",
            "Finishing"
        };

        stageNameText.text = names[stage - 1];
    }

    public void RequestEstimate()
    {
        // Make sure dropdowns contain options.
        if (houseDropdown.options.Count == 0 ||
            wallDropdown.options.Count == 0 ||
            roofDropdown.options.Count == 0 ||
            stateDropdown.options.Count == 0)
        {
            Debug.LogError("Dropdown options are missing!");
            return;
        }

        // Prepare the estimate request.
        EstimateRequest request = new EstimateRequest
        {
            houseType = houseDropdown.options[houseDropdown.value].text,

            wall = new string[]
            {
                "brick", "flyash", "block"
            }[wallDropdown.value],

            roof = new string[]
            {
                "rcc", "tin"
            }[roofDropdown.value],

            state = stateDropdown.options[stateDropdown.value].text
        };

        // Send request to the API.
        apiClient.GetEstimate(request, DisplayEstimate);
    }

    void DisplayEstimate(EstimateResponse result)
    {
        if (result == null || result.stages == null)
        {
            Debug.LogError("Invalid estimate response!");
            return;
        }

        totalText.text =
            "Total Cost: Rs " + result.total.ToString("N0");

        if (result.offline)
        {
            totalText.text += " (Offline Estimate)";
        }

        stageText.text =
            "Foundation: Rs " + result.stages.foundation.ToString("N0") +
            "\nWalls: Rs " + result.stages.walls.ToString("N0") +
            "\nRoof: Rs " + result.stages.roof.ToString("N0") +
            "\nFinishing: Rs " + result.stages.finishing.ToString("N0");
    }
}
