
using UnityEngine;

// Changes house size and colors based on dropdown choices.
public class HouseVisualizer : MonoBehaviour
{
    public Transform house;
    public Renderer walls;
    public Renderer roof;

    // Order: brick, flyash, block
    Color[] wallColors = {
        new Color(0.70f, 0.30f, 0.20f),
        new Color(0.65f, 0.65f, 0.65f),
        new Color(0.85f, 0.80f, 0.70f)
    };

    // Order: rcc, tin
    Color[] roofColors = {
        new Color(0.40f, 0.40f, 0.40f),
        new Color(0.30f, 0.50f, 0.70f)
    };

    public void ApplyHouseType(int index)
    {
        house.localScale = index == 0
            ? new Vector3(1f, 1f, 1f)
            : new Vector3(1.3f, 1f, 1.3f);
    }

    public void ApplyWall(int index)
    {
        walls.material.color = wallColors[index];
    }

    public void ApplyRoof(int index)
    {
        roof.material.color = roofColors[index];
    }
}
