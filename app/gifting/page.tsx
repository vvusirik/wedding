import Image from "next/image";
import styles from "./page.module.css";

export default function GiftingPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Gifting</h1>
            <p className={styles.intro}>
                Your presence is the greatest gift you could give us! We don't have a
                registry and ask that you please refrain from bringing boxed gifts.
            </p>
            <p className={styles.intro}>
                If you would still like to gift us, you can do so in the Indian
                tradition of Shagun, an envelope with a gift card or an odd numbered
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
