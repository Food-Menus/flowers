document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    // const mainContent = document.querySelector('.main-content'); // Removed as we no longer push content
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.main-nav ul.nav-links');
    const allNavLinks = document.querySelectorAll('.main-nav ul.nav-links li a');

    // --- Sidebar Toggle Functionality ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        // mainContent.classList.toggle('sidebar-open'); // Removed as we no longer push content
    });

    // Close sidebar if clicked outside (optional, but good UX)
    document.addEventListener('click', (e) => {
        // Check if the clicked element is not the sidebar itself, nor the toggle button
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            // mainContent.classList.remove('sidebar-open'); // Removed
        }
    });

    // --- Mobile Navigation Menu Toggle ---
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
            }
        });
    });

    // --- Image Slider Functionality ---
    const sliderImages = document.querySelectorAll('.slider img');
    const sliderText = document.querySelector('.slider-text');
    let currentSlide = 0;

    function setSliderHeight() {
        const viewportHeight = window.innerHeight;
        const targetHeight = Math.max(viewportHeight * 0.35, 250); // Set to 35% or min 250px
        document.querySelector('.hero-section').style.height = `${targetHeight}px`;
    }

    function showSlide(index) {
        sliderImages.forEach((img) => {
            img.classList.remove('active');
        });
        sliderText.classList.remove('active'); // Hide text during transition

        sliderImages[index].classList.add('active');
        // Show text after a short delay to match image fade-in
        setTimeout(() => {
            if (sliderImages[index].classList.contains('active')) {
                sliderText.classList.add('active');
            }
        }, 500); // Adjust delay as needed for smoother text appearance
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % sliderImages.length;
        showSlide(currentSlide);
    }

    if (sliderImages.length > 0) {
        setSliderHeight(); // Set initial height
        window.addEventListener('resize', setSliderHeight); // Adjust height on resize
        showSlide(currentSlide);
        setInterval(nextSlide, 3000); // Change image every 3 seconds
    }

    // --- Active Navigation Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop();
    allNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- Product Image Hover Effect ---
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
        const mainImage = item.querySelector('img');
        const hoverSrc = mainImage.getAttribute('data-hover-src');

        // Create a separate image element for the hover effect
        if (hoverSrc) {
            const hoverImageElement = document.createElement('img');
            hoverImageElement.src = hoverSrc;
            hoverImageElement.classList.add('hover-img');
            item.insertBefore(hoverImageElement, mainImage.nextSibling); // Insert after main image
        }
    });

    // --- Product filtering and search (for products.html) ---
    const categoryFilter = document.getElementById('category-filter');
    const searchBar = document.getElementById('search-bar');
    const allProductsPageItems = document.querySelectorAll('.products-page .product-item');

    function filterProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const searchTerm = searchBar ? searchBar.value.toLowerCase() : '';

        allProductsPageItems.forEach(item => {
            const productCategory = item.getAttribute('data-category');
            const productName = item.querySelector('h3').textContent.toLowerCase();
            const productDescription = item.querySelector('p').textContent.toLowerCase();

            const matchesCategory = (selectedCategory === 'all' || productCategory === selectedCategory);
            const matchesSearch = (productName.includes(searchTerm) || productDescription.includes(searchTerm));

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (searchBar) {
        searchBar.addEventListener('keyup', filterProducts);
    }
    if (allProductsPageItems.length > 0 && (categoryFilter || searchBar)) {
        filterProducts();
    }
});