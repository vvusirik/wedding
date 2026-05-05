import Image from "next/image";
import styles from "./page.module.css";

export default function GiftingPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Gifting</h1>
            <p className={styles.intro}>
                Your attendance is the greatest gift you could give us! As such, we do
                not have a registry and ask that you please refrain from bringing
                physical gifts as we won&rsquo;t be able to take items back to New York
                and our closets are already full.
            </p>
            <p className={styles.intro}>
                If you are feeling especially generous and truly insist, you may gift us
                in the Indian tradition of Shagun, an envelope with an odd numbered
                amount of dollars that symbolizes good fortune.
            </p>
            <div className={styles.imageWrapper}>
                <Image
                    src="/images/cat_in_gift_box.png"
                    alt="Cat in a gift box"
                    width={400}
                    height={500}
                    className={styles.image}
                />
            </div>
        </div>
    );
}
