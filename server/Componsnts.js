
function loadComponents() {

/*######################################  Header  ##############################################*/

        const HeaderElement = document.getElementById('Header');
        if (!HeaderElement) return;
        
        const HeaderPath0 = HeaderElement.getAttribute('HeaderPath0') || '#';
        const HeaderPath1 = HeaderElement.getAttribute('HeaderPath1') || '#';
        const HeaderPath2 = HeaderElement.getAttribute('HeaderPath2') || '#';
        const HeaderPath3 = HeaderElement.getAttribute('HeaderPath3') || '#';
        
        HeaderElement.innerHTML = `
            <header class="header">
                <br>

                <div class="navbar-top">
                    <button class="sidebar-toggle" aria-label="Toggle sidebar">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="logo">
                        <img src="${HeaderPath0}" alt="شعار المتجر" class="logo-img">
                    </div>
                </div>
                <nav class="main-nav">
                    <button class="menu-toggle" aria-label="Toggle navigation menu">
                        <i class="fas fa-bars"></i>
                    </button>
                    <ul class="nav-links">
                        <li><a href="${HeaderPath1}" class="active">الرئيسية</a></li>
                        <li><a href="${HeaderPath2}">باقاتنا</a></li>
                        <li><a href="${HeaderPath3}">من نحن</a></li>
                    </ul>
                </nav>
            </header>
        `;
        

/*######################################  Sidebar  ##############################################*/

        const SidebarElement = document.getElementById('Sidebar');
        if (!SidebarElement) return;
        
        const SidebarPath1 = SidebarElement.getAttribute('SidebarPath1') || '#';
        const SidebarPath2 = SidebarElement.getAttribute('SidebarPath2') || '#';
        const SidebarPath3 = SidebarElement.getAttribute('SidebarPath3') || '#';
        const SidebarPath4 = SidebarElement.getAttribute('SidebarPath4') || '#';
        const SidebarPath5 = SidebarElement.getAttribute('SidebarPath5') || '#';
        
        SidebarElement.innerHTML = `
            <aside class="sidebar">
                <h2>Red Flowers</h2>
                <ul>
                    <li><a href="${SidebarPath1}">   متابعة الطلب  </a></li>
                    <li><a href="${SidebarPath2}">   موقع المتجر  </a></li>
                    <li><a href="${SidebarPath4}">   شاركنا رأيك </a></li>
                    <li><a href="${SidebarPath3}">   تسجيل مدير المتجر </a></li>
                    <button class="qr-btn" onclick="showQRModal()">
                        <i class="fas fa-qrcode"></i> مسح الكود للتواصل
                    </button><br>

                    <a href="${SidebarPath5}" download class="download-apk-btn">
                        <i class="fas fa-mobile-alt"></i>  تحميل التطبيق للاندرويد 
                    </a>
                </li>

            </aside>
        `;
        
/*######################################  Footer  ##############################################*/

        const FooterElement = document.getElementById('Footer');
        if (FooterElement) {
            FooterElement.innerHTML = `
                <footer class="footer">
                    <p>Copyright © 2025 Techno Science All rights reserved </p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=61552612523046&mibextid=ZbWKwL"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/red_flowers.01208901095"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </footer>
            `;
        }
        
/*####################################################################################################*/

}
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/
/*###############################  load Products suggestions  ########################################*/

    function loadProducts() {
        const sheetID = '1CK5wjrpnDTkriEfs8XRo5Sgnq07HHKsyO1pGU_tQguU';
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

        // دالة تحديث عداد السلة
        function updateCartCounter() {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const cartCountElement = document.querySelector('.cart-count');
            
            if (cartCountElement) {
                cartCountElement.textContent = cartItems.length;
                
                // تأثير النبض عند التحديث
                cartCountElement.classList.add('pulse');
                setTimeout(() => {
                    cartCountElement.classList.remove('pulse');
                }, 500);
            }
        }

        // دالة تشغيل صوت الإشعار
        function playNotificationSound() {
            const sound = document.getElementById('notification-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log("لم يتم تشغيل الصوت:", e));
            }
        }

        // دالة عرض إشعار التمديد
        function showCartNotification() {
            const cart = document.querySelector('.floating-cart');
            if (cart) {
                cart.classList.add('expanded');
                setTimeout(() => {
                    cart.classList.remove('expanded');
                }, 5000);
            }
        }

        // دالة إضافة إلى السلة
        window.addToCart = function(productName, productPrice) {
            playNotificationSound();
            
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push({ 
                name: productName, 
                price: productPrice 
            });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            updateCartCounter();
            showCartNotification();
            
            swal({
                title: "تمت الإضافة بنجاح",
                text: `${productName} تمت إضافته إلى السلة`,
                icon: "success",
                button: "موافق",
                timer: 2000
            });
        };

    fetch(sheetUrl)
            .then(res => res.text())
            .then(text => {
                const jsonData = JSON.parse(text.substr(47).slice(0, -2));
                const rows = jsonData.table.rows;
                
                const products = rows.map((row, index) => {
                    if (index === 0) return null;
                    const cells = row.c;
                    return {
                        id: cells[0]?.v || '',
                        name: cells[1]?.v || '',
                        details: cells[2]?.v || '',
                        price: cells[3]?.v || '0',
                        type: cells[4]?.v || '',
                        image1: cells[5]?.v || '',
                        image2: cells[6]?.v || ''
                    };
                }).filter(product => product !== null);

                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                const cheapestProducts = products.slice(0, 2);
                const expensiveProducts = products.slice(-2);
                const selectedProducts = [...cheapestProducts, ...expensiveProducts];

                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    // مسح المحتوى الحالي قبل إضافة المنتجات الجديدة
                    productContainer.innerHTML = '';
                    
                    selectedProducts.forEach(product => {
                        const productItem = document.createElement('div');
                        productItem.className = 'product-item';
                        
                        productItem.innerHTML = `
                          
                                <div class="product-image-container">
                                    <img src="${product.image1}" data-hover-src="${product.image2}" alt="${product.name}">
                                </div>
                                <h3>${product.name}</h3>
                                <p>${product.details}</p>
                                <span>${product.price} جنية</span>
                           
                            <button class="add-to-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', '${product.price}')">
                                أضف إلى السلة
                            </button>
                        `;
                        
                        productContainer.appendChild(productItem);
                    });

                    // إضافة تأثير تغيير الصورة
                    document.querySelectorAll('.product-image-container').forEach(container => {
                        const img = container.querySelector('img');
                        const hoverSrc = img.getAttribute('data-hover-src');
                        
                        if (hoverSrc) {
                            const hoverImg = new Image();
                            hoverImg.src = hoverSrc;
                            hoverImg.style.position = 'absolute';
                            hoverImg.style.top = '0';
                            hoverImg.style.left = '0';
                            hoverImg.style.opacity = '0';
                            hoverImg.style.transition = 'opacity 0.5s ease';
                            container.appendChild(hoverImg);

                            container.addEventListener('mouseenter', () => {
                                img.style.opacity = '0';
                                hoverImg.style.opacity = '1';
                            });

                            container.addEventListener('mouseleave', () => {
                                img.style.opacity = '1';
                                hoverImg.style.opacity = '0';
                            });
                        }
                    });
                }

                updateCartCounter();
            })
            .catch(error => {
                console.error('حدث خطأ أثناء جلب البيانات:', error);
                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    productContainer.innerHTML = '<p>عذرًا، حدث خطأ أثناء تحميل المنتجات.</p>';
                }
            });
    }
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل ionicons
        const ioniconsScript = document.createElement('script');
        ioniconsScript.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
        document.head.appendChild(ioniconsScript);
        
        // تحميل SweetAlert إذا لم يكن محملاً
        if (typeof swal === 'undefined') {
            const swalScript = document.createElement('script');
            swalScript.src = 'https://unpkg.com/sweetalert/dist/sweetalert.min.js';
            document.head.appendChild(swalScript);
        }
        
        loadProducts();
    });
        
/*####################################################################################################*/
/*###################################  load Data Products  ###########################################*/

    function loadDataProducts() {
        const sheetID = '1CK5wjrpnDTkriEfs8XRo5Sgnq07HHKsyO1pGU_tQguU';
        const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

        async function fetchProducts() {
            const response = await fetch(baseURL);
            const data = await response.text();
            const jsonData = JSON.parse(data.substr(47).slice(0, -2));

            return jsonData.table.rows.map(row => {
                return {
                    id: row.c[0].v,
                    name: row.c[1].v,
                    details: row.c[2].v,
                    price: row.c[3].v,
                    type: row.c[4].v,
                    image1: row.c[5].v,
                    image2: row.c[6].v
                };
            });
        }

        // دالة تحديث عداد السلة
        window.addToCart = function(productName, productPrice, productImage) {
            // تشغيل صوت الإشعار
            playNotificationSound();
            
            // إضافة المنتج للسلة
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push({ 
                name: productName, 
                price: productPrice,
                image: productImage
            });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // تحديث العداد
            updateCartCounter();
            
            // عرض تأثير التمديد
            showCartNotification();
            
            // عرض تنبيه SweetAlert
            swal({
                title: "تمت الإضافة بنجاح",
                text: `${productName} تمت إضافته إلى السلة`,
                icon: "success",
                button: "موافق",
                timer: 2000
            });
        };

        function playNotificationSound() {
            const sound = document.getElementById('notification-sound');
            if (sound) {
                sound.currentTime = 0; // إعادة التشغيل من البداية
                sound.play().catch(e => console.log("لم يتم تشغيل الصوت:", e));
            }
        }

        function showCartNotification() {
            const cart = document.querySelector('.floating-cart');
            if (cart) {
                // إضافة كلاس expanded
                cart.classList.add('expanded');
                
                // إزالة الكلاس بعد 5 ثواني
                setTimeout(() => {
                    cart.classList.remove('expanded');
                }, 5000);
            }
        }

        function updateCartCounter() {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const cartCountElement = document.querySelector('.cart-count');
            
            if (cartCountElement) {
                cartCountElement.textContent = cartItems.length;
                
                // تأثير النبض عند التحديث
                cartCountElement.classList.add('pulse');
                setTimeout(() => {
                    cartCountElement.classList.remove('pulse');
                }, 500);
            }
        }

        async function displayProducts() {
            const products = await fetchProducts();
            const productGrid = document.getElementById("productGrid");
            productGrid.innerHTML = "";

            const categoryFilter = document.getElementById("category-filter");
            const searchBar = document.getElementById("search-bar");

            function filterProducts() {
                const searchTerm = searchBar.value.toLowerCase();
                const selectedCategory = categoryFilter.value;

                const filteredProducts = products.filter(product => {
                    const matchesCategory = selectedCategory === "all" || product.type === selectedCategory;
                    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                        product.details.toLowerCase().includes(searchTerm);
                    return matchesCategory && matchesSearch;
                });

                productGrid.innerHTML = "";
                filteredProducts.forEach(product => {
                    const card = document.createElement("div");
                    card.className = "product-item";
                    card.setAttribute("data-category", product.type);

                    card.innerHTML = `
                            <div class="product-image-container">
                                <img class="main-image" src="${product.image1}" alt="${product.name}">
                                <img class="hover-image" src="${product.image2}" alt="${product.name}">
                            </div>
                            <h3>${product.name}</h3>
                            <p>${product.details}</p>
                            <span>${product.price} جنية</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', '${product.price}', '${product.image1}')">
                            أضف إلى السلة
                        </button>
                    `;
                    productGrid.appendChild(card);
                });
            }

            // تحديث العداد عند تحميل الصفحة
            updateCartCounter();

            filterProducts();
            categoryFilter.addEventListener("change", filterProducts);
            searchBar.addEventListener("input", filterProducts);
        }

        displayProducts();
    }

    document.addEventListener('DOMContentLoaded', function() {
        const ioniconsScript = document.createElement('script');
        ioniconsScript.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
        document.head.appendChild(ioniconsScript);
    });
/*####################################################################################################*/
/*####################################################################################################*/

    // حدث تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل المكونات
        loadComponents();
        
        // تحميل الباقات المقترحه
        loadProducts();
        
        // تحميل الباقات
        loadDataProducts();
        
        // إعداد السلايدر
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        setInterval(nextSlide, 3000);
        
        document.addEventListener('click', function(event) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            
            // إذا كان النقر خارج السايدبار وخارج زر التفعيل وكانت السايدبار مفتوحة
            if (!sidebar.contains(event.target) && 
                event.target !== sidebarToggle && 
                !sidebarToggle.contains(event.target) && 
                sidebar.classList.contains('open')) {
                
                sidebar.classList.remove('open');
            }
        });
        // إعداد السايدبار
        document.querySelector('.sidebar-toggle')?.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // إعداد القائمة الرئيسية
        document.querySelector('.menu-toggle')?.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('open');
        });

        // إخفاء الـ Preloader
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.classList.add('fade-out');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }

    
    });