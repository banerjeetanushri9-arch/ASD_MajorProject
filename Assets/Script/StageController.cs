
using UnityEngine;

// Shows or hides house parts based on construction stage (1 to 4).
public class StageController : MonoBehaviour
{
    public GameObject foundation, walls, roof, door;

    public void SetStage(int stage)
    {
        foundation.SetActive(stage >= 1);
        walls.SetActive(stage >= 2);
        roof.SetActive(stage >= 3);
        door.SetActive(stage >= 4);
    }
}
