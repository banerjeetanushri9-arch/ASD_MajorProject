
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

// Tap on a detected surface to place the house.
// Drag with one finger to move it. Pinch to scale. Twist with two fingers to rotate.
public class ARPlaceHouse : MonoBehaviour
{
    public ARRaycastManager raycastManager;
    public ARPlaneManager planeManager;
    public GameObject houseRoot;
    public GameObject instructionObject;
    public float minScale = 0.02f;
    public float maxScale = 0.4f;

    static List<ARRaycastHit> hits = new List<ARRaycastHit>();
    bool placed = false;

    void Update()
    {
        if (Input.touchCount == 1)
        {
            Touch t = Input.GetTouch(0);
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(t.fingerId)) return;

            if (t.phase == TouchPhase.Began || t.phase == TouchPhase.Moved)
            {
                if (raycastManager.Raycast(t.position, hits, TrackableType.PlaneWithinPolygon))
                {
                    Pose pose = hits[0].pose;
                    houseRoot.transform.position = pose.position;

                    if (!placed)
                    {
                        placed = true;
                        houseRoot.SetActive(true);
                        FaceUser();
                        if (instructionObject != null) instructionObject.SetActive(false);
                    }
                }
            }
        }
        else if (Input.touchCount == 2 && placed)
        {
            Touch a = Input.GetTouch(0);
            Touch b = Input.GetTouch(1);

            Vector2 prevA = a.position - a.deltaPosition;
            Vector2 prevB = b.position - b.deltaPosition;
            Vector2 prevVec = prevA - prevB;
            Vector2 currVec = a.position - b.position;

            if (prevVec.magnitude > 0.01f)
            {
                float factor = currVec.magnitude / prevVec.magnitude;
                float s = Mathf.Clamp(houseRoot.transform.localScale.x * factor, minScale, maxScale);
                houseRoot.transform.localScale = new Vector3(s, s, s);
            }

            float angle = Vector2.SignedAngle(prevVec, currVec);
            houseRoot.transform.Rotate(0f, -angle, 0f);
        }
    }

    void FaceUser()
    {
        Camera cam = Camera.main;
        if (cam == null) return;
        Vector3 dir = cam.transform.position - houseRoot.transform.position;
        dir.y = 0;
        if (dir.sqrMagnitude > 0.001f)
            houseRoot.transform.rotation = Quaternion.LookRotation(-dir);
    }

    public void HidePlanes()
    {
        planeManager.enabled = false;
        foreach (var plane in planeManager.trackables)
            plane.gameObject.SetActive(false);
    }
}
