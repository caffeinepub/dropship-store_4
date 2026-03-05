import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : Text;
    category : Text;
    inStock : Bool;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    email : Text;
    phone : Text;
    shippingAddress : Text;
    items : Text;
    totalAmount : Float;
    status : Text;
    createdAt : Int;
  };

  type Enquiry = {
    id : Nat;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    createdAt : Int;
    isRead : Bool;
  };

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let enquiries = Map.empty<Nat, Enquiry>();

  var nextProductId = 7;
  var nextOrderId = 1;
  var nextEnquiryId = 1;

  // Seed initial products (array)
  let initialProducts : [Product] = [
    {
      id = 1;
      name = "Wireless Earbuds";
      description = "High-quality wireless earbuds with noise cancellation.";
      price = 79.99;
      imageUrl = "https://example.com/images/earbuds.jpg";
      category = "Electronics";
      inStock = true;
    },
    {
      id = 2;
      name = "Smart Watch";
      description = "Feature-rich smart watch with fitness tracking.";
      price = 129.99;
      imageUrl = "https://example.com/images/smartwatch.jpg";
      category = "Electronics";
      inStock = true;
    },
    {
      id = 3;
      name = "Yoga Mat";
      description = "Eco-friendly yoga mat with non-slip surface.";
      price = 35.0;
      imageUrl = "https://example.com/images/yogamat.jpg";
      category = "Fitness";
      inStock = true;
    },
    {
      id = 4;
      name = "Water Bottle";
      description = "Insulated stainless steel water bottle.";
      price = 19.99;
      imageUrl = "https://example.com/images/waterbottle.jpg";
      category = "Fitness";
      inStock = true;
    },
    {
      id = 5;
      name = "Bluetooth Speaker";
      description = "Portable Bluetooth speaker with powerful bass.";
      price = 49.99;
      imageUrl = "https://example.com/images/speaker.jpg";
      category = "Electronics";
      inStock = true;
    },
    {
      id = 6;
      name = "Fitness Tracker";
      description = "Wearable fitness tracker with heart rate monitor.";
      price = 59.99;
      imageUrl = "https://example.com/images/fitnesstracker.jpg";
      category = "Fitness";
      inStock = true;
    },
  ];

  // Seed initial products into products map
  for (product in initialProducts.values()) {
    products.add(product.id, product);
  };

  // Public endpoints
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func submitOrder(
    customerName : Text,
    email : Text,
    phone : Text,
    shippingAddress : Text,
    items : Text,
    totalAmount : Float,
  ) : async Nat {
    let order : Order = {
      id = nextOrderId;
      customerName;
      email;
      phone;
      shippingAddress;
      items;
      totalAmount;
      status = "Pending";
      createdAt = Time.now();
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public shared ({ caller }) func submitEnquiry(
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
  ) : async () {
    let enquiry : Enquiry = {
      id = nextEnquiryId;
      name;
      email;
      subject;
      message;
      createdAt = Time.now();
      isRead = false;
    };
    enquiries.add(nextEnquiryId, enquiry);
    nextEnquiryId += 1;
  };

  // Admin-only endpoints
  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customerName = order.customerName;
          email = order.email;
          phone = order.phone;
          shippingAddress = order.shippingAddress;
          items = order.items;
          totalAmount = order.totalAmount;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getEnquiries() : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    enquiries.values().toArray();
  };

  public shared ({ caller }) func markEnquiryRead(enquiryId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (enquiries.get(enquiryId)) {
      case (null) {
        Runtime.trap("Enquiry not found");
      };
      case (?enquiry) {
        let updatedEnquiry : Enquiry = {
          id = enquiry.id;
          name = enquiry.name;
          email = enquiry.email;
          subject = enquiry.subject;
          message = enquiry.message;
          createdAt = enquiry.createdAt;
          isRead = true;
        };
        enquiries.add(enquiryId, updatedEnquiry);
      };
    };
  };
};
