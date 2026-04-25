// --- VARIABEL GLOBAL UNTUK PAGINATION ---
const VIDEOS_PER_PAGE = 6; // Maksimal 6 video per halaman
let currentPage = 1;
let allVideosData = []; // Menyimpan semua data video

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SETUP TOMBOL ORDER ---
    let navigates = document.querySelectorAll('.navigate');
    navigates.forEach(navigate => {
        navigate.addEventListener('click', () => {
            const info = document.querySelector(".hidden-info");
            info.style.display = "flex"; // Menggunakan flex agar kotak modal berada di tengah
        });
    });

    // Menutup Modal Order jika mengeklik di luar kotak hitam (opsional tapi disarankan)
    const modalBg = document.querySelector(".hidden-info");
    modalBg.addEventListener('click', (e) => {
        if (e.target === modalBg) {
            modalBg.style.display = "none";
        }
    });

    // --- 2. LOAD YOUTUBE FEED ---
    loadYouTubeFeed();

    function loadYouTubeFeed() {
        const feedContainer = document.getElementById('youtube-feed');

        // Tampilkan animasi loading sementara video diproses
        feedContainer.innerHTML = `
            <div class="video-placeholder" style="grid-column: 1 / -1; text-align: center;">
                <div class="loading"></div>
                <p>Memuat portofolio video...</p>
            </div>
        `;

        setTimeout(() => {
            // ==========================================
            // 👇 MASUKKAN DATA VIDEO YOUTUBE MILIKMU DI SINI 👇
            // ==========================================
            allVideosData = [
                {
                    id: 'O2tUnJKeB38', 
                    title: 'Wait, Exit 8 is in Hospital 666?! | @Dokibird @mintfantome #shorts',
                    duration: '00:47',
                    views: '752',
                    date: '15 April 2026'
                },
                {
                    id: 'RfLEpDOizT4', 
                    title: '"Does he see me?" YES. | @MariYumeLive #shorts',
                    duration: '00:40',
                    views: '1.5k',
                    date: '6 April 2026'
                },
                {
                    id: 'Lt3akRnNB4g', 
                    title: 'Never trust a VTuber with a Flamethrower | @MariYumeLive #shorts',
                    duration: '01:12',
                    views: '1.2k',
                    date: '4 April 2026'
                },                
                {
                    id: 'MoK-8xZugsc', 
                    title: 'Perfect Cut Moment - @MariYumeReacts #shorts',
                    duration: '00:20',
                    views: '1.9k',
                    date: '17 Maret 2026'
                },
                {
                    id: 'xndq5-59Rgw', 
                    title: 'Perangkat SCAM!?!? - Content Warning - Original Video From: @KoboKanaeru#contentwarning #shorts',
                    duration: '01:08', 
                    views: '57',       
                    date: '7 Maret 2026' 
                },
                // CONTOH TAMBAHAN VIDEO MASA DEPAN:
                // { id: 'ContohID6', title: 'Video Ke-6', duration: '01:00', views: '1k', date: '1 Jan 2027' },
                // { id: 'ContohID7', title: 'Video Ke-7', duration: '01:00', views: '1k', date: '2 Jan 2027' }, // Ini akan masuk halaman 2
            ];
            // ==========================================

            renderPost();
            renderPagination();
        }, 800); // Simulasi loading
    }

    // --- 3. RENDER (TAMPILKAN) VIDEO BERDASARKAN HALAMAN ---
    function renderPost() {
        const feedContainer = document.getElementById('youtube-feed');
        
        if (allVideosData.length === 0) {
            feedContainer.innerHTML = `
                <div class="video-placeholder" style="grid-column: 1 / -1; text-align: center;">
                    <i class="fas fa-video-slash" style="font-size: 40px; color: #555; margin-bottom: 15px;"></i>
                    <p style="color: #888;">Video portofolio belum ditambahkan.</p>
                </div>
            `;
            return;
        }

        // Hitung index video awal dan akhir untuk halaman ini
        const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
        const endIndex = startIndex + VIDEOS_PER_PAGE;
        const videosToShow = allVideosData.slice(startIndex, endIndex);

        // Looping data video dan buat HTML-nya
        feedContainer.innerHTML = videosToShow.map(video => `
            <div class="video-card fade-in">
                <div class="video-thumbnail" data-video-id="${video.id}">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <div class="video-title">${video.title}</div>
                    <div class="video-meta">
                        <span>${video.views} views</span>
                        <span>${video.date}</span>
                    </div>
                </div>
            </div>
        `).join('');

        setupThumbnailClickHandlers();
    }

    // --- 4. RENDER TOMBOL PAGINATION (HALAMAN 1, 2, 3...) ---
    function renderPagination() {
        const totalPages = Math.ceil(allVideosData.length / VIDEOS_PER_PAGE);
        let paginationContainer = document.getElementById('pagination-container');
        
        // Buat container pagination jika belum ada di HTML
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-container';
            paginationContainer.className = 'pagination';
            
            // Masukkan tepat di bawah container youtube-feed
            const feedContainer = document.getElementById('youtube-feed');
            feedContainer.parentNode.insertBefore(paginationContainer, feedContainer.nextSibling);
        }

        // Jika hanya 1 halaman (video 6 atau kurang), sembunyikan pagination
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Tombol Prev
        if (currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}">&laquo; Prev</button>`;
        }

        // Tombol Angka (1, 2, 3)
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<button class="page-btn active" data-page="${i}">${i}</button>`;
            } else {
                paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
            }
        }

        // Tombol Next
        if (currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}">Next &raquo;</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;

        // Tambahkan Event Listener ke setiap tombol
        const pageButtons = paginationContainer.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderPost();
                renderPagination();
                
                // Scroll halus kembali ke judul Portofolio
                document.querySelector('.title:nth-of-type(2)').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // --- 5. KLIK THUMBNAIL UNTUK PLAY VIDEO ---
    function setupThumbnailClickHandlers() {
        const thumbnails = document.querySelectorAll('.video-thumbnail');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                this.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                `;
            });
        });
    }
});