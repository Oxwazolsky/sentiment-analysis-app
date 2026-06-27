import os
import pickle
import random
import re
from collections import Counter
import pandas as pd
import numpy as np

# Pengecualian impor: jika ada missing library, kita tetap pakai mock jika error
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    import emoji
    import nltk
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
    
    # Download resource NLTK jika belum ada (bypass SSL issue jika ada)
    import ssl
    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context

    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('stopwords', quiet=True)
    
    HAS_ALL_DEPS = True
except ImportError as e:
    print(f"Peringatan: Dependensi kurang ({e}). Sistem akan menggunakan Mock Model.")
    HAS_ALL_DEPS = False

# Path ke file model sesuai dengan yang Anda unggah
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model_sentimen_lstm_final.h5")
TOKENIZER_PATH = os.path.join(os.path.dirname(__file__), "model", "tokenizer.pickle")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "model", "label_encoder.pickle")

class ReviewPredictor:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.encoder = None
        self.is_mock = True
        self.max_length = 60 # Sesuai dengan konfigurasi di notebook Anda
        
        # Inisialisasi CACHE untuk mempercepat Sastrawi Stemmer
        self.stem_cache = {}
        
        if HAS_ALL_DEPS:
            # Setup Sastrawi Stemmer
            factory = StemmerFactory()
            self.stemmer = factory.create_stemmer()
            
            # Setup Stopwords NLTK (Bahasa Indonesia) + Pengecualian kata penting
            self.list_stopwords = set(stopwords.words('indonesian'))
            exceptions = ["tidak", "jangan", "bukan", "kurang", "belum"]
            for exc in exceptions:
                if exc in self.list_stopwords:
                    self.list_stopwords.remove(exc)
            
            # Setup Kamus Slang sesuai notebook
            self.slang_dict = {
                "yg": "yang", "dgn": "dengan", "bapuk": "jelek", "lemot": "lambat", 
                "tdk": "tidak", "ga": "tidak", "gk": "tidak", "gak": "tidak", 
                "bgs": "bagus", "mantap": "bagus", "gw": "saya", "sy": "saya", 
                "bgt": "banget", "knp": "kenapa", "klo": "kalau", "apk": "aplikasi",
                "afk": "keluar", "ngebug": "rusak", "bug": "rusak", "ngelag": "macet",
                "lag": "macet", "bocil": "anak kecil", "toxic": "kasar", "nerf": "lemah",
                "buff": "kuat", "op": "kuat", "bapuk": "jelek", "gemmmm": "game",
                "game": "permainan", "bintang 1": "sangat kecewa", "ilang": "hilang",
                "busuk": "jelek", "ngeframe": "macet"
            }

        self.load_artifacts()

    def load_artifacts(self):
        """Memuat model dan tokenizer jika tersedia. Jika tidak, gunakan Mock."""
        if HAS_ALL_DEPS and os.path.exists(MODEL_PATH) and os.path.exists(TOKENIZER_PATH) and os.path.exists(ENCODER_PATH):
            try:
                # Custom object dictionary in case keras has trouble
                self.model = load_model(MODEL_PATH)
                with open(TOKENIZER_PATH, 'rb') as handle:
                    self.tokenizer = pickle.load(handle)
                with open(ENCODER_PATH, 'rb') as handle:
                    self.encoder = pickle.load(handle)
                
                self.is_mock = False
                print("==================================================")
                print("BERHASIL: Model LSTM Asli dan Preprocessing Dimuat")
                print("==================================================")
            except Exception as e:
                print(f"Gagal memuat model: {e}. Menggunakan Mock Model.")
                self.is_mock = True
        else:
            print("File model tidak lengkap atau library kurang. Menggunakan Mock Model.")
            self.is_mock = True

    def preprocess_text(self, text: str) -> str:
        """Fungsi preprocessing yang identik dengan notebook Jupyter Anda dengan Cache Optimization."""
        if not HAS_ALL_DEPS:
            # Fallback mock preprocessing
            return text.lower()
            
        # 0. Case Folding Awal & Penanganan Frasa Negasi (Kelemahan Model)
        text = str(text).lower()
        phrases_to_replace = {
            "kurang memuaskan": "kecewa",
            "tidak memuaskan": "kecewa",
            "kurang bagus": "jelek",
            "tidak bagus": "jelek",
            "kurang suka": "benci",
            "tidak suka": "benci",
            "sangat kurang": "jelek",
            "ga seru": "membosankan",
            "tidak seru": "membosankan"
        }
        for phrase, replacement in phrases_to_replace.items():
            text = text.replace(phrase, replacement)
            
        # 1. Cleansing (Hapus URL, Emoji, Karakter non-alfabet, dan huruf berulang >2)
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = emoji.replace_emoji(text, replace='')
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'(.)\1{2,}', r'\1', text) 
        
        # 2. Normalisasi Slang & Spasi Berlebih
        words = text.split()
        normalized_words = [self.slang_dict.get(word.lower(), word) for word in words]
        text = ' '.join(normalized_words)
        text = re.sub(r'\s+', ' ', text).strip()
        
        # 3. Case Folding (Kecil)
        text = text.lower()
        
        # 4. Tokenisasi
        tokens = word_tokenize(text)
        
        # 5. Stopword Removal
        tokens = [word for word in tokens if word not in self.list_stopwords]
        
        # 6. Stemming (Dioptimasi dengan Dictionary Cache O(1) Lookup)
        stemmed_tokens = []
        for t in tokens:
            if t not in self.stem_cache:
                # Jika kata belum pernah di-stemming, lakukan stemming dan simpan ke cache
                self.stem_cache[t] = self.stemmer.stem(t)
            stemmed_tokens.append(self.stem_cache[t])
            
        stemmed_text = ' '.join(stemmed_tokens)
        
        return stemmed_text

    def predict_single(self, text: str):
        preprocessed = self.preprocess_text(text)
        
        if self.is_mock:
            # --- MOCK LOGIC ---
            if any(word in preprocessed for word in ['jelek', 'buruk', 'bug', 'lag', 'keluar', 'susah', 'gacha']):
                rating = random.choice([1, 2])
                sentiment = "Negatif"
                confidence = random.uniform(0.75, 0.98)
            elif any(word in preprocessed for word in ['bagus', 'keren', 'mantap', 'seru', 'gg', 'terbaik']):
                rating = random.choice([4, 5])
                sentiment = "Positif"
                confidence = random.uniform(0.80, 0.99)
            else:
                rating = 3
                sentiment = "Netral"
                confidence = random.uniform(0.50, 0.75)
                
            return {
                "original_text": text,
                "preprocessed_text": preprocessed,
                "rating": rating,
                "sentiment": sentiment,
                "confidence": round(confidence * 100, 2)
            }
        else:
            # --- REAL INFERENCE LOGIC (Model LSTM Asli) ---
            # 1. Konversi Teks ke Sequence & Padding
            seq = self.tokenizer.texts_to_sequences([preprocessed])
            padded = pad_sequences(seq, maxlen=self.max_length, padding='post', truncating='post')
            
            # 2. Prediksi Probabilitas
            pred_probs = self.model.predict(padded, verbose=0)[0]
            label_idx = np.argmax(pred_probs)
            confidence = float(pred_probs[label_idx])
            
            # 3. Kembalikan ke Label Teks Asli (Positif/Negatif/Netral) menggunakan LabelEncoder
            sentiment = self.encoder.inverse_transform([label_idx])[0]
            
            # 4. Transformasi Sentimen ke Estimasi Bintang (karena model Anda hanya memprediksi kelas sentimen)
            sentiment_str = str(sentiment).lower()
            if sentiment_str == 'positif':
                rating = random.choice([4, 5])
            elif sentiment_str == 'negatif':
                rating = random.choice([1, 2])
            else:
                rating = 3
                
            return {
                "original_text": text,
                "preprocessed_text": preprocessed,
                "rating": rating,
                "sentiment": sentiment_str.capitalize(),
                "confidence": round(confidence * 100, 2)
            }

    def predict_batch(self, df: pd.DataFrame, text_column: str = 'content'):
        """Optimized Batch Prediction"""
        results = []
        all_words_neg = []
        all_words_pos = []
        
        texts = []
        for idx, row in df.iterrows():
            text = str(row[text_column]) if text_column in row else str(row.iloc[0])
            texts.append(text)
            
        print(f"Mulai preprocessing {len(texts)} baris data...")
        preprocessed_texts = [self.preprocess_text(t) for t in texts]
        print("Preprocessing selesai. Mulai inferensi model LSTM...")
        
        if self.is_mock:
            for i in range(len(texts)):
                pred = self.predict_single(texts[i])
                results.append(pred)
                if pred['sentiment'].lower() == 'negatif':
                    all_words_neg.extend(pred['preprocessed_text'].split())
                elif pred['sentiment'].lower() == 'positif':
                    all_words_pos.extend(pred['preprocessed_text'].split())
        else:
            seqs = self.tokenizer.texts_to_sequences(preprocessed_texts)
            padded = pad_sequences(seqs, maxlen=self.max_length, padding='post', truncating='post')
            
            preds = self.model.predict(padded, batch_size=256, verbose=0)
            
            label_indices = np.argmax(preds, axis=1)
            confidences = np.max(preds, axis=1)
            
            sentiments = self.encoder.inverse_transform(label_indices)
            
            for i in range(len(texts)):
                sentiment_str = str(sentiments[i]).lower()
                if sentiment_str == 'positif':
                    rating = random.choice([4, 5])
                    all_words_pos.extend(preprocessed_texts[i].split())
                elif sentiment_str == 'negatif':
                    rating = random.choice([1, 2])
                    all_words_neg.extend(preprocessed_texts[i].split())
                else:
                    rating = 3
                    
                results.append({
                    "original_text": texts[i],
                    "preprocessed_text": preprocessed_texts[i],
                    "rating": rating,
                    "sentiment": sentiment_str.capitalize(),
                    "confidence": round(float(confidences[i]) * 100, 2)
                })
        
        print("Pemrosesan massal selesai!")
        
        counts_neg = Counter(all_words_neg)
        counts_pos = Counter(all_words_pos)
        
        word_cloud_neg_data = [{"text": word, "value": count} for word, count in counts_neg.most_common(50)]
        word_cloud_pos_data = [{"text": word, "value": count} for word, count in counts_pos.most_common(50)]
        
        total = len(results)
        rating_sum = sum(r['rating'] for r in results)
        sentiment_counts = Counter(r['sentiment'] for r in results)
        
        return {
            "average_rating": round(rating_sum / total, 2) if total > 0 else 0,
            "sentiment_distribution": [
                {"name": "Positif", "value": sentiment_counts.get("Positif", 0)},
                {"name": "Netral", "value": sentiment_counts.get("Netral", 0)},
                {"name": "Negatif", "value": sentiment_counts.get("Negatif", 0)}
            ],
            "word_cloud_negative": word_cloud_neg_data,
            "word_cloud_positive": word_cloud_pos_data,
            "results": results
        }

# Instance global (Singleton)
predictor = ReviewPredictor()
