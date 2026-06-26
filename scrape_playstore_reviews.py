from google_play_scraper import app, reviews, Sort
import pandas as pd
from tqdm import tqdm
import time

# ==================================================
# CONFIG
# ==================================================

APP_ID = "com.miniclip.eightballpool"     # Ganti sesuai aplikasi

TOTAL_REVIEWS = 2000                      # Jumlah review

LANG = "id"
COUNTRY = "id"

OUTPUT_FILE = "dataset_review_mentah_8ballpool.csv"

# ==================================================
# INFORMASI APLIKASI
# ==================================================

def get_app_info(app_id):

    try:

        info = app(
            app_id,
            lang=LANG,
            country=COUNTRY
        )

        print("\n========== INFORMASI APLIKASI ==========")

        print(f"Nama App   : {info['title']}")
        print(f"Developer  : {info['developer']}")
        print(f"Rating App : {info['score']}")
        print(f"Installs   : {info['installs']}")

        return info

    except Exception as e:

        print("Gagal mengambil informasi aplikasi")

        print(e)

        return None


# ==================================================
# SCRAPING REVIEW
# ==================================================

def scrape_reviews(app_id, total_reviews):

    all_reviews = []

    continuation_token = None

    batch_size = 200

    total_loop = total_reviews // batch_size + 1

    print("\nMulai Scraping Review...\n")

    for _ in tqdm(range(total_loop)):

        try:

            result, continuation_token = reviews(

                app_id,

                lang=LANG,

                country=COUNTRY,

                sort=Sort.NEWEST,

                count=batch_size,

                continuation_token=continuation_token

            )

            all_reviews.extend(result)

            if continuation_token is None:
                break

            time.sleep(1.5)

        except Exception as e:

            print(e)

            break

    return all_reviews[:total_reviews]


# ==================================================
# MEMBUAT DATAFRAME
# ==================================================

def build_dataframe(review_data):

    rows = []

    for review in review_data:

        rows.append({

            "review": review.get("content", "").strip(),

            "likes": review.get("thumbsUpCount", 0),

            "date": review.get("at"),

            "reply_content": review.get("replyContent", ""),

            "reply_date": review.get("repliedAt")

        })

    return pd.DataFrame(rows)


# ==================================================
# CLEAN DATASET
# ==================================================

def clean_dataset(df):

    print("\nMembersihkan Dataset...")

    before = len(df)

    # Hapus review kosong
    df = df[df["review"].str.strip() != ""]

    # Hapus review NULL
    df = df.dropna(subset=["review"])

    # Hapus review duplikat
    df = df.drop_duplicates(
        subset=["review"],
        keep="first"
    )

    df.reset_index(drop=True, inplace=True)

    after = len(df)

    print(f"Total sebelum cleaning : {before}")

    print(f"Total sesudah cleaning : {after}")

    print(f"Review dihapus         : {before-after}")

    return df


# ==================================================
# MAIN
# ==================================================

def main():

    print("="*55)

    print(" GOOGLE PLAY STORE REVIEW SCRAPER ")

    print("="*55)

    print(f"\nAPP ID : {APP_ID}")

    get_app_info(APP_ID)

    review_data = scrape_reviews(

        APP_ID,

        TOTAL_REVIEWS

    )

    print(f"\nReview berhasil diambil : {len(review_data)}")

    df = build_dataframe(review_data)

    df = clean_dataset(df)

    df.to_csv(

        OUTPUT_FILE,

        index=False,

        encoding="utf-8-sig"

    )

    print("\nDataset berhasil disimpan.")

    print(f"Nama File : {OUTPUT_FILE}")

    print("\n5 Data Pertama:\n")

    print(df.head())


if __name__ == "__main__":

    main()