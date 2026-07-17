package com.foodfiesta.seed;

import com.foodfiesta.model.Complaint;
import com.foodfiesta.model.Coupon;
import com.foodfiesta.model.DeliveryPartner;
import com.foodfiesta.model.MenuItem;
import com.foodfiesta.model.MenuSection;
import com.foodfiesta.model.Order;
import com.foodfiesta.model.OrderItem;
import com.foodfiesta.model.OrderStatus;
import com.foodfiesta.model.PaymentMethod;
import com.foodfiesta.model.Restaurant;
import com.foodfiesta.model.RestaurantStatus;
import com.foodfiesta.model.Review;
import com.foodfiesta.service.ComplaintService;
import com.foodfiesta.service.CouponService;
import com.foodfiesta.service.DeliveryService;
import com.foodfiesta.service.MenuService;
import com.foodfiesta.service.OrderService;
import com.foodfiesta.service.ReviewService;
import com.foodfiesta.service.RestaurantService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Seeds every in-memory service with a full, believable data set on startup.
 * Nothing here is persisted - it exists only for the lifetime of the JVM.
 *
 * Photos are real, stable food photographs served by LoremFlickr - the
 * {@code lock} parameter pins a specific photo to a specific keyword so the
 * same dish always shows the same image across restarts and refreshes.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final DeliveryService deliveryService;
    private final CouponService couponService;
    private final ComplaintService complaintService;
    private final ReviewService reviewService;
    private final OrderService orderService;

    public DataSeeder(RestaurantService restaurantService, MenuService menuService, DeliveryService deliveryService,
                       CouponService couponService, ComplaintService complaintService, ReviewService reviewService,
                       OrderService orderService) {
        this.restaurantService = restaurantService;
        this.menuService = menuService;
        this.deliveryService = deliveryService;
        this.couponService = couponService;
        this.complaintService = complaintService;
        this.reviewService = reviewService;
        this.orderService = orderService;
    }

    private record Dish(MenuSection section, String name, String description, double price, boolean veg,
                         boolean bestseller, String imageUrl) {
    }

    @Override
    public void run(String... args) {
        seedRestaurantsAndMenus();
        seedDeliveryPartners();
        seedCoupons();
        seedReviews();
        seedOrders();
        seedComplaints();
    }

    private void seedRestaurantsAndMenus() {
        // South Indian
        seedRestaurant("r1", "South Spice", "South Indian",
                "https://images.unsplash.com/photo-1630383249896-424e482df921?w=640&q=80",
                4.3, 25, "12, Temple Street, Basavanagudi, Bengaluru", 380, List.of(
                        new Dish(MenuSection.BREAKFAST, "Masala Dosa",
                                "Crisp rice crepe filled with spiced potato masala, served with sambar & chutney",
                                110, true, true,
                                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Idli Sambar",
                                "Steamed rice cakes with piping hot sambar and coconut chutney",
                                90, true, false,
                                "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Medu Vada",
                                "Crispy lentil doughnuts served with sambar",
                                100, true, false,
                                "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Rava Kesari",
                                "Semolina breakfast pudding with ghee and cashews",
                                80, true, false,
                                "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=480&q=80")
                ));

        // North Indian
        seedRestaurant("r2", "Punjabi Tadka", "North Indian",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&q=80",
                4.4, 30, "45, Model Town, Ludhiana Road, Delhi NCR", 420, List.of(
                        new Dish(MenuSection.BREAKFAST, "Chole Bhature",
                                "Spiced chickpea curry with fluffy fried bread",
                                160, true, true,
                                "https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Aloo Paratha",
                                "Stuffed potato flatbread with butter and curd",
                                130, true, false,
                                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Stuffed Kulcha",
                                "Paneer-stuffed kulcha with pickle",
                                140, true, false,
                                "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=480&q=80")
                ));

        // Chinese
        seedRestaurant("r3", "Dragon Wok", "Chinese",
                "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=640&q=80",
                4.2, 28, "7, Chinatown Lane, Tangra, Kolkata", 360, List.of(
                        new Dish(MenuSection.BREAKFAST, "Veg Momos",
                                "Steamed dumplings filled with veggies, served with chilli dip",
                                120, true, false,
                                "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Chicken Momos",
                                "Steamed chicken dumplings with spicy dip",
                                140, false, true,
                                "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Chilli Garlic Noodles Bowl",
                                "Wok-tossed noodles in chilli garlic sauce",
                                150, true, false,
                                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=480&q=80")
                ));

        // Italian
        seedRestaurant("r4", "Bella Italia", "Italian / Continental",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&q=80",
                4.6, 35, "3, Piazza Court, Bandra West, Mumbai", 550, List.of(
                        new Dish(MenuSection.BREAKFAST, "Bruschetta Trio",
                                "Toasted ciabatta with tomato-basil, mushroom, and ricotta toppings",
                                220, true, false,
                                "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Frittata",
                                "Baked Italian omelette with spinach and parmesan",
                                200, false, false,
                                "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Croissant with Jam",
                                "Buttery croissant with house-made berry jam",
                                150, true, false,
                                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=480&q=80")
                ));

        // Fast Food
        seedRestaurant("r5", "Quick Bite", "Fast Food & Burgers",
                "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=640&q=80",
                4.0, 20, "88, Highway Junction, Andheri East, Mumbai", 300, List.of(
                        new Dish(MenuSection.BREAKFAST, "Egg & Cheese Muffin",
                                "English muffin with fried egg and cheddar",
                                110, false, false,
                                "https://images.unsplash.com/photo-1550317138-10000687a72b?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Hash Browns",
                                "Crispy golden potato hash browns (4 pcs)",
                                90, true, false,
                                "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Breakfast Burrito",
                                "Scrambled egg, cheese and salsa wrap",
                                140, false, false,
                                "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=480&q=80")
                ));

        // Biryani & Mughlai
        seedRestaurant("r6", "Nawab's Kitchen", "Biryani & Mughlai",
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=640&q=80",
                4.5, 32, "21, Nawab Chowk, Charminar Road, Hyderabad", 480, List.of(
                        new Dish(MenuSection.BREAKFAST, "Sheermal with Nihari",
                                "Saffron flatbread served with slow-cooked nihari",
                                220, false, false,
                                "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Egg Kheema Pav",
                                "Spiced minced meat and egg with buttered pav",
                                170, false, false,
                                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Bun Kebab",
                                "Spiced patty in a soft bun with chutney",
                                130, false, false,
                                "https://images.unsplash.com/photo-1544025162-d76538485696?w=480&q=80")
                ));

        // Bakery & Desserts
        seedRestaurant("r7", "Sweet Treats Bakery", "Bakery & Desserts",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=80",
                4.4, 22, "56, Baker's Lane, Camp Area, Pune", 320, List.of(
                        new Dish(MenuSection.BREAKFAST, "Butter Croissant",
                                "Flaky all-butter French croissant",
                                90, true, false,
                                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Cinnamon Roll",
                                "Warm roll with cinnamon-sugar swirl and glaze",
                                110, true, false,
                                "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Banana Bread Slice",
                                "Moist banana bread with walnuts",
                                100, true, false,
                                "https://images.unsplash.com/photo-1548366086-7f1b76106622?w=480&q=80")
                ));

        // Healthy Food
        seedRestaurant("r8", "Green Bowl", "Healthy Food & Salads",
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=80",
                4.5, 24, "9, Wellness Street, Indiranagar, Bengaluru", 350, List.of(
                        new Dish(MenuSection.BREAKFAST, "Oats & Berries Bowl",
                                "Overnight oats with mixed berries and honey",
                                140, true, false,
                                "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Avocado Toast",
                                "Multigrain toast with smashed avocado and chilli flakes",
                                180, true, true,
                                "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=480&q=80"),
                        new Dish(MenuSection.BREAKFAST, "Sprouts Salad",
                                "Protein-rich mixed sprouts with lemon dressing",
                                120, true, false,
                                "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=480&q=80")
                ));
    }

    private void seedRestaurant(String id, String name, String cuisine, String imageUrl, double rating,
                                 int deliveryTime, String address, double avgCost, List<Dish> dishes) {
        restaurantService.save(new Restaurant(id, name, cuisine, rating, deliveryTime, imageUrl,
                address, RestaurantStatus.ACTIVE, false, avgCost));
        int index = 0;
        for (Dish dish : dishes) {
            index++;
            String itemId = id + "-item-" + index;
            menuService.save(new MenuItem(itemId, id, dish.name(), dish.description(), dish.section(),
                    dish.price(), dish.imageUrl(), dish.veg(), true, dish.bestseller()));
        }
    }

    private void seedDeliveryPartners() {
        deliveryService.save(new DeliveryPartner("dp1", "Ravi Kumar", "Bike", 4.7, true, 860, 180, 240, 128));
        deliveryService.save(new DeliveryPartner("dp2", "Suresh Babu", "Bike", 4.6, true, 640, 120, 150, 96));
        deliveryService.save(new DeliveryPartner("dp3", "Ayesha Khan", "Scooter", 4.8, true, 510, 140, 210, 84));
        deliveryService.save(new DeliveryPartner("dp4", "Vikram Singh", "Bike", 4.5, true, 720, 100, 130, 110));
        deliveryService.save(new DeliveryPartner("dp5", "Lakshmi Iyer", "Bicycle", 4.9, false, 340, 80, 160, 62));
    }

    private void seedCoupons() {
        couponService.save(new Coupon("coupon-1", "WELCOME50", "Flat 50% off up to ₹100 on your first order", 50, 100, 199, true));
        couponService.save(new Coupon("coupon-2", "FEAST20", "20% off up to ₹150 on orders above ₹399", 20, 150, 399, true));
        couponService.save(new Coupon("coupon-3", "FREESHIP", "Free delivery on all orders, no minimum", 100, 40, 0, true));
        couponService.save(new Coupon("coupon-4", "BIGGIE30", "30% off up to ₹120 on orders above ₹599", 30, 120, 599, false));
        couponService.save(new Coupon("coupon-5", "TRYNEW", "Flat 15% off up to ₹75 on orders above ₹149", 15, 75, 149, true));
    }

    private void seedReviews() {
        reviewService.save(new Review("review-1", "r1", "Ananya Rao", 5, "Best dosa in the city, tastes just like Chennai!", java.time.Instant.now().minusSeconds(86400)));
        reviewService.save(new Review("review-2", "r1", "Ishaan Gupta", 4, "Great taste, delivery took a bit longer than expected.", java.time.Instant.now().minusSeconds(43200)));
        reviewService.save(new Review("review-3", "r2", "Karan Mehta", 5, "Butter chicken is out of this world.", java.time.Instant.now().minusSeconds(72000)));
        reviewService.save(new Review("review-4", "r4", "Rohan Verma", 5, "Authentic wood-fired pizza, loved the tiramisu too.", java.time.Instant.now().minusSeconds(50000)));
        reviewService.save(new Review("review-5", "r6", "Farhan Ali", 4, "Biryani was flavorful, portion could be bigger.", java.time.Instant.now().minusSeconds(20000)));
        reviewService.save(new Review("review-6", "r8", "Aditya Rao", 5, "Finally a healthy option that doesn't taste bland.", java.time.Instant.now().minusSeconds(9000)));
    }

    private OrderItem oi(String menuItemId, String name, double price, int quantity) {
        return new OrderItem(menuItemId, name, price, quantity);
    }

    private String txn() {
        return "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }

    private void seedOrders() {
        Order a = new Order();
        a.setUserId("seed-user-1");
        a.setUserName("Ananya Rao");
        a.setRestaurantId("r1");
        a.setRestaurantName("South Spice");
        a.setRestaurantImageUrl("https://images.unsplash.com/photo-1630383249896-424e482df921?w=640&q=80");
        a.setItems(List.of(oi("r1-item-1", "Masala Dosa", 110, 2), oi("r1-item-17", "Filter Coffee", 60, 2)));
        a.setItemsTotal(340);
        a.setDeliveryFee(29);
        a.setTaxes(17);
        a.setDiscount(0);
        a.setTotalAmount(386);
        a.setDeliveryAddress("204, Lake View Apartments, Koramangala 5th Block, Bengaluru");
        a.setPaymentMethod(PaymentMethod.GOOGLE_PAY);
        a.setTransactionId(txn());
        a.setStatus(OrderStatus.DELIVERED);
        a.setDeliveryPartnerId("dp1");
        a.setDeliveryPartnerName("Ravi Kumar");
        a.setEstimatedDeliveryMinutes(0);
        orderService.create(a);

        Order b = new Order();
        b.setUserId("seed-user-2");
        b.setUserName("Karan Mehta");
        b.setRestaurantId("r2");
        b.setRestaurantName("Punjabi Tadka");
        b.setRestaurantImageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&q=80");
        b.setItems(List.of(oi("r2-item-5", "Butter Chicken", 340, 1), oi("r2-item-9", "Tandoori Roti Basket", 90, 1)));
        b.setItemsTotal(430);
        b.setDeliveryFee(35);
        b.setTaxes(21.5);
        b.setDiscount(50);
        b.setCouponCode("WELCOME50");
        b.setTotalAmount(436.5);
        b.setDeliveryAddress("14, Sunrise Enclave, Sector 21, Gurugram");
        b.setPaymentMethod(PaymentMethod.PHONE_PE);
        b.setTransactionId(txn());
        b.setStatus(OrderStatus.ON_THE_WAY);
        b.setDeliveryPartnerId("dp2");
        b.setDeliveryPartnerName("Suresh Babu");
        b.setEstimatedDeliveryMinutes(10);
        orderService.create(b);

        Order c = new Order();
        c.setUserId("seed-user-3");
        c.setUserName("Priya Singh");
        c.setRestaurantId("r3");
        c.setRestaurantName("Dragon Wok");
        c.setRestaurantImageUrl("https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=640&q=80");
        c.setItems(List.of(oi("r3-item-2", "Chicken Momos", 140, 2), oi("r3-item-8", "Hakka Noodles", 190, 1)));
        c.setItemsTotal(470);
        c.setDeliveryFee(32);
        c.setTaxes(23.5);
        c.setDiscount(0);
        c.setTotalAmount(525.5);
        c.setDeliveryAddress("77, Salt Lake Sector V, Kolkata");
        c.setPaymentMethod(PaymentMethod.BHIM_UPI);
        c.setTransactionId(txn());
        c.setStatus(OrderStatus.PICKED_UP);
        c.setDeliveryPartnerId("dp3");
        c.setDeliveryPartnerName("Ayesha Khan");
        c.setEstimatedDeliveryMinutes(15);
        orderService.create(c);

        Order d = new Order();
        d.setUserId("seed-user-4");
        d.setUserName("Rohan Verma");
        d.setRestaurantId("r4");
        d.setRestaurantName("Bella Italia");
        d.setRestaurantImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&q=80");
        d.setItems(List.of(oi("r4-item-5", "Margherita Pizza", 380, 1), oi("r4-item-13", "Tiramisu", 240, 1)));
        d.setItemsTotal(620);
        d.setDeliveryFee(40);
        d.setTaxes(31);
        d.setDiscount(0);
        d.setTotalAmount(691);
        d.setDeliveryAddress("501, Sea Breeze Towers, Bandra West, Mumbai");
        d.setPaymentMethod(PaymentMethod.CARD);
        d.setTransactionId(txn());
        d.setStatus(OrderStatus.READY_FOR_PICKUP);
        d.setEstimatedDeliveryMinutes(20);
        orderService.create(d);

        Order e = new Order();
        e.setUserId("seed-user-5");
        e.setUserName("Sanya Kapoor");
        e.setRestaurantId("r5");
        e.setRestaurantName("Quick Bite");
        e.setRestaurantImageUrl("https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=640&q=80");
        e.setItems(List.of(oi("r5-item-5", "Classic Cheeseburger", 180, 2), oi("r5-item-7", "Loaded Fries", 160, 1)));
        e.setItemsTotal(520);
        e.setDeliveryFee(25);
        e.setTaxes(26);
        e.setDiscount(0);
        e.setTotalAmount(571);
        e.setDeliveryAddress("9, Palm Residency, Andheri East, Mumbai");
        e.setPaymentMethod(PaymentMethod.COD);
        e.setTransactionId(txn());
        e.setStatus(OrderStatus.PREPARING);
        e.setEstimatedDeliveryMinutes(28);
        orderService.create(e);

        Order f = new Order();
        f.setUserId("seed-user-6");
        f.setUserName("Farhan Ali");
        f.setRestaurantId("r6");
        f.setRestaurantName("Nawab's Kitchen");
        f.setRestaurantImageUrl("https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=640&q=80");
        f.setItems(List.of(oi("r6-item-5", "Hyderabadi Biryani", 320, 2), oi("r6-item-13", "Shahi Tukda", 150, 1)));
        f.setItemsTotal(790);
        f.setDeliveryFee(38);
        f.setTaxes(39.5);
        f.setDiscount(0);
        f.setTotalAmount(867.5);
        f.setDeliveryAddress("18, Nawab Residency, Charminar Road, Hyderabad");
        f.setPaymentMethod(PaymentMethod.PAYTM);
        f.setTransactionId(txn());
        f.setStatus(OrderStatus.PLACED);
        f.setEstimatedDeliveryMinutes(35);
        orderService.create(f);

        Order g = new Order();
        g.setUserId("seed-user-7");
        g.setUserName("Meera Nair");
        g.setRestaurantId("r7");
        g.setRestaurantName("Sweet Treats Bakery");
        g.setRestaurantImageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=80");
        g.setItems(List.of(oi("r7-item-13", "Red Velvet Cupcake", 90, 3), oi("r7-item-4", "Cold Brew", 130, 1)));
        g.setItemsTotal(400);
        g.setDeliveryFee(28);
        g.setTaxes(20);
        g.setDiscount(0);
        g.setTotalAmount(448);
        g.setDeliveryAddress("32, Camp Residency, Pune");
        g.setPaymentMethod(PaymentMethod.GOOGLE_PAY);
        g.setTransactionId(txn());
        g.setStatus(OrderStatus.DELIVERED);
        g.setDeliveryPartnerId("dp1");
        g.setDeliveryPartnerName("Ravi Kumar");
        g.setEstimatedDeliveryMinutes(0);
        orderService.create(g);

        Order h = new Order();
        h.setUserId("seed-user-8");
        h.setUserName("Aditya Rao");
        h.setRestaurantId("r8");
        h.setRestaurantName("Green Bowl");
        h.setRestaurantImageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=80");
        h.setItems(List.of(oi("r8-item-5", "Quinoa Buddha Bowl", 260, 1), oi("r8-item-4", "Green Detox Juice", 130, 1)));
        h.setItemsTotal(390);
        h.setDeliveryFee(30);
        h.setTaxes(19.5);
        h.setDiscount(0);
        h.setTotalAmount(439.5);
        h.setDeliveryAddress("5, Wellness Street, Indiranagar, Bengaluru");
        h.setPaymentMethod(PaymentMethod.NET_BANKING);
        h.setTransactionId(txn());
        h.setStatus(OrderStatus.DELIVERED);
        h.setDeliveryPartnerId("dp4");
        h.setDeliveryPartnerName("Vikram Singh");
        h.setEstimatedDeliveryMinutes(0);
        orderService.create(h);

        Order i = new Order();
        i.setUserId("seed-user-9");
        i.setUserName("Ishaan Gupta");
        i.setRestaurantId("r1");
        i.setRestaurantName("South Spice");
        i.setRestaurantImageUrl("https://images.unsplash.com/photo-1630383249896-424e482df921?w=640&q=80");
        i.setItems(List.of(oi("r1-item-2", "Idli Sambar", 90, 2), oi("r1-item-17", "Filter Coffee", 60, 1)));
        i.setItemsTotal(240);
        i.setDeliveryFee(29);
        i.setTaxes(12);
        i.setDiscount(0);
        i.setTotalAmount(281);
        i.setDeliveryAddress("11, Temple View, Basavanagudi, Bengaluru");
        i.setPaymentMethod(PaymentMethod.BHIM_UPI);
        i.setTransactionId(txn());
        i.setStatus(OrderStatus.PLACED);
        i.setEstimatedDeliveryMinutes(35);
        orderService.create(i);

        // keep references alive for the complaint seeding step
        this.seededOrderB = b;
        this.seededOrderC = c;
        this.seededOrderE = e;
        this.seededOrderG = g;
    }

    private Order seededOrderB;
    private Order seededOrderC;
    private Order seededOrderE;
    private Order seededOrderG;

    private void seedComplaints() {
        complaintService.save(complaint("ticket-301", "Order arrived cold", "The food was lukewarm by the time it reached me, packaging seemed fine though.",
                "Food Quality", "OPEN", "Karan Mehta", seededOrderB != null ? seededOrderB.getId() : null, 7200));
        complaintService.save(complaint("ticket-302", "Wrong item delivered", "I ordered Hakka Noodles but received Schezwan Fried Rice instead.",
                "Order Accuracy", "IN_PROGRESS", "Priya Singh", seededOrderC != null ? seededOrderC.getId() : null, 14400));
        complaintService.save(complaint("ticket-303", "Delivery partner was rude", "The rider was impatient and rude over a call regarding the apartment gate.",
                "Delivery Experience", "OPEN", "Sanya Kapoor", seededOrderE != null ? seededOrderE.getId() : null, 3600));
        complaintService.save(complaint("ticket-304", "Refund not processed", "Cancelled an item from my order but the refund hasn't reflected yet.",
                "Payments", "RESOLVED", "Meera Nair", seededOrderG != null ? seededOrderG.getId() : null, 172800));
    }

    private Complaint complaint(String id, String subject, String description, String category, String status,
                                 String userName, String orderId, long secondsAgo) {
        return new Complaint(id, subject, description, category, status, userName, orderId,
                java.time.Instant.now().minusSeconds(secondsAgo));
    }
}
