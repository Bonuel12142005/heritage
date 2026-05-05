import { ArtisanShowcase, ProductShowcase, productCategories } from '../models/artisanShowcaseMods.js';

class ShowcaseController {
    // Public: Artisan & Product Showcase main page
    async getShowcase(req, res) {
        try {
            const featuredArtisans = await ArtisanShowcase.getFeatured(4);
            const featuredProducts = await ProductShowcase.getFeatured(8);
            const specialties = await ArtisanShowcase.getSpecialties();
            const categories = ProductShowcase.getCategories();

            res.render('artisan-showcase', {
                title: 'Local Artisans & Products - HeritageLink',
                user: req.session.user,
                featuredArtisans,
                featuredProducts,
                specialties,
                categories
            });
        } catch (err) {
            console.error('Showcase page error:', err);
            res.render('artisan-showcase', {
                title: 'Local Artisans & Products - HeritageLink',
                user: req.session.user,
                featuredArtisans: [],
                featuredProducts: [],
                specialties: [],
                categories: productCategories
            });
        }
    }

    // Public: All artisans page
    async getAllArtisans(req, res) {
        try {
            const filters = {
                specialty: req.query.specialty,
                search: req.query.search
            };
            const artisans = await ArtisanShowcase.findAll(filters);
            const specialties = await ArtisanShowcase.getSpecialties();

            res.render('artisans-list', {
                title: 'Local Artisans - HeritageLink',
                user: req.session.user,
                artisans,
                specialties,
                filters
            });
        } catch (err) {
            console.error('Artisans list error:', err);
            res.render('artisans-list', {
                title: 'Local Artisans - HeritageLink',
                user: req.session.user,
                artisans: [],
                specialties: [],
                filters: {}
            });
        }
    }

    // Public: Single artisan profile
    async getArtisanProfile(req, res) {
        try {
            const artisan = await ArtisanShowcase.findById(req.params.id);
            
            if (!artisan) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Artisan not found'
                });
            }

            const products = await ProductShowcase.findByArtisan(req.params.id);

            res.render('artisan-profile-public', {
                title: `${artisan.name} - HeritageLink`,
                user: req.session.user,
                artisan,
                products
            });
        } catch (err) {
            console.error('Artisan profile error:', err);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load artisan profile'
            });
        }
    }

    // Public: All products page
    async getAllProducts(req, res) {
        try {
            const filters = {
                category: req.query.category,
                search: req.query.search,
                min_price: req.query.min_price,
                max_price: req.query.max_price
            };
            const products = await ProductShowcase.findAll(filters);
            const categories = ProductShowcase.getCategories();

            res.render('products-showcase', {
                title: 'Handcrafted Products - HeritageLink',
                user: req.session.user,
                products,
                categories,
                filters
            });
        } catch (err) {
            console.error('Products list error:', err);
            res.render('products-showcase', {
                title: 'Handcrafted Products - HeritageLink',
                user: req.session.user,
                products: [],
                categories: productCategories,
                filters: {}
            });
        }
    }

    // Public: Single product detail
    async getProductDetail(req, res) {
        try {
            const product = await ProductShowcase.findById(req.params.id);
            
            if (!product) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Product not found'
                });
            }

            // Get related products from same artisan
            const relatedProducts = await ProductShowcase.findByArtisan(product.artisan_id);
            const related = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

            res.render('product-detail', {
                title: `${product.name} - HeritageLink`,
                user: req.session.user,
                product,
                relatedProducts: related
            });
        } catch (err) {
            console.error('Product detail error:', err);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load product'
            });
        }
    }

    // API: Get artisans
    async apiGetArtisans(req, res) {
        try {
            const filters = {
                specialty: req.query.specialty,
                search: req.query.search,
                featured: req.query.featured === 'true'
            };
            const artisans = await ArtisanShowcase.findAll(filters);
            res.json({ success: true, artisans });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to fetch artisans' });
        }
    }

    // API: Get products
    async apiGetProducts(req, res) {
        try {
            const filters = {
                category: req.query.category,
                artisan_id: req.query.artisan_id,
                search: req.query.search,
                min_price: req.query.min_price ? parseFloat(req.query.min_price) : null,
                max_price: req.query.max_price ? parseFloat(req.query.max_price) : null,
                limit: req.query.limit
            };
            const products = await ProductShowcase.findAll(filters);
            res.json({ success: true, products });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to fetch products' });
        }
    }

    // API: Get single artisan
    async apiGetArtisan(req, res) {
        try {
            const artisan = await ArtisanShowcase.findById(req.params.id);
            if (!artisan) {
                return res.status(404).json({ success: false, error: 'Artisan not found' });
            }
            const products = await ProductShowcase.findByArtisan(req.params.id);
            res.json({ success: true, artisan, products });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to fetch artisan' });
        }
    }

    // API: Get single product
    async apiGetProduct(req, res) {
        try {
            const product = await ProductShowcase.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }
            res.json({ success: true, product });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to fetch product' });
        }
    }

    // API: Get categories
    async apiGetCategories(req, res) {
        res.json({ success: true, categories: productCategories });
    }
}

export default new ShowcaseController();
