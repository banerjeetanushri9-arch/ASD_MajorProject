
using UnityEngine;
using UnityEngine.EventSystems;

// Drag to orbit around the house, scroll or pinch to zoom.
public class CameraOrbit : MonoBehaviour
{
    public Transform target;
    public float distance = 9f;
    public float minDistance = 4f;
    public float maxDistance = 18f;
    public float rotateSpeed = 4f;
    public float zoomSpeed = 1.5f;

    float yaw = 20f;
    float pitch = 20f;

    void LateUpdate()
    {
        if (target == null) return;

        if (Input.touchCount == 0)
        {
            // Mouse controls
            if (Input.GetMouseButton(0) &&
                (EventSystem.current == null ||
                 !EventSystem.current.IsPointerOverGameObject()))
            {
                yaw += Input.GetAxis("Mouse X") * rotateSpeed;
                pitch -= Input.GetAxis("Mouse Y") * rotateSpeed;
            }

            distance -= Input.mouseScrollDelta.y * zoomSpeed;
        }
        else if (Input.touchCount == 1)
        {
            // One finger drag
            Touch t = Input.GetTouch(0);

            if (t.phase == TouchPhase.Moved &&
                (EventSystem.current == null ||
                 !EventSystem.current.IsPointerOverGameObject(t.fingerId)))
            {
                yaw += t.deltaPosition.x * 0.2f;
                pitch -= t.deltaPosition.y * 0.2f;
            }
        }
        else if (Input.touchCount >= 2)
        {
            // Pinch zoom
            Touch a = Input.GetTouch(0);
            Touch b = Input.GetTouch(1);

            float prev = ((a.position - a.deltaPosition) -
                          (b.position - b.deltaPosition)).magnitude;

            float curr = (a.position - b.position).magnitude;

            distance -= (curr - prev) * 0.01f;
        }

        pitch = Mathf.Clamp(pitch, 5f, 80f);
        distance = Mathf.Clamp(distance, minDistance, maxDistance);

        Quaternion rot = Quaternion.Euler(pitch, yaw, 0);

        Vector3 lookPoint = target.position + Vector3.up * 1.2f;

        transform.position = lookPoint +
                             rot * new Vector3(0, 0, -distance);

        transform.LookAt(lookPoint);
    }
}
