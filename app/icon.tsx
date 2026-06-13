import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 32 32"
                    width="32"
                    height="32"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#dd523f"
                        d="M16 28 C16 28 3 19 3 11 C3 7 6 4 9.5 4 C12 4 14.5 5.5 16 8 C17.5 5.5 20 4 22.5 4 C26 4 29 7 29 11 C29 19 16 28 16 28 Z"
                    />
                </svg>
            </div>
        ),
        { ...size },
    );
}
