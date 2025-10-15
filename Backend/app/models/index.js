// Import all models
const User = require('./User');
const Product = require('./Product');
const ProductImages = require('./ProductImages');
const Brand = require('./Brand');
const Collection = require('./Collection');
const Shape = require('./Shape');
const Gender = require('./Gender');
const LensMaterial = require('./LensMaterial');
const LensColor = require('./LensColor');
const FrameMaterial = require('./FrameMaterial');
const FrameColor = require('./FrameColor');
const Type = require('./Type');
const RoleType = require('./RoleType');
const Slider = require('./Slider');
const Country = require('./Country');
const State = require('./State');
const Cities = require('./Cities');
const Zone = require('./Zone');
const Expense = require('./Expense');

// Import business models
const AllotedOrders = require('./AllotedOrders');
const DistributorBrands = require('./DistributorBrands');
const DistributorWorkingState = require('./DistributorWorkingState');
const RetailorWorkingState = require('./RetailorWorkingState');
const TrayAllotment = require('./TrayAllotment');
const SalesmanTarget = require('./SalesmanTarget');
const OrderDetails = require('./OrderDetails');
const Notification = require('./Notification');
const LoginHistory = require('./LoginHistory');

// Define associations

// Product associations
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Product.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' });
Product.belongsTo(Shape, { foreignKey: 'shape_id', as: 'shape' });
Product.belongsTo(Gender, { foreignKey: 'gender_id', as: 'gender' });
Product.belongsTo(LensMaterial, { foreignKey: 'lens_material_id', as: 'lensMaterial' });
Product.belongsTo(LensColor, { foreignKey: 'lens_color_id', as: 'lensColor' });
Product.belongsTo(FrameMaterial, { foreignKey: 'frame_material_id', as: 'frameMaterial' });
Product.belongsTo(FrameColor, { foreignKey: 'frame_color_id', as: 'frameColor' });
Product.belongsTo(Type, { foreignKey: 'type_id', as: 'type' });

// Reverse associations for Product
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Collection.hasMany(Product, { foreignKey: 'collection_id', as: 'products' });
Shape.hasMany(Product, { foreignKey: 'shape_id', as: 'products' });
Gender.hasMany(Product, { foreignKey: 'gender_id', as: 'products' });
LensMaterial.hasMany(Product, { foreignKey: 'lens_material_id', as: 'products' });
LensColor.hasMany(Product, { foreignKey: 'lens_color_id', as: 'products' });
FrameMaterial.hasMany(Product, { foreignKey: 'frame_material_id', as: 'products' });
FrameColor.hasMany(Product, { foreignKey: 'frame_color_id', as: 'products' });
Type.hasMany(Product, { foreignKey: 'type_id', as: 'products' });

// ProductImages associations
ProductImages.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(ProductImages, { foreignKey: 'product_id', as: 'images' });

// Location associations (Country -> State -> City)
Country.hasMany(State, { foreignKey: 'country_id', as: 'states' });
State.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });

State.hasMany(Cities, { foreignKey: 'state_id', as: 'cities' });
Cities.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Zone associations
Zone.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Zone.belongsTo(Cities, { foreignKey: 'city_id', as: 'city' });
State.hasMany(Zone, { foreignKey: 'state_id', as: 'zones' });
Cities.hasMany(Zone, { foreignKey: 'city_id', as: 'zones' });

// Business model associations
AllotedOrders.belongsTo(User, { foreignKey: 'distributor_id', as: 'distributor' });

DistributorBrands.belongsTo(User, { foreignKey: 'distributor_id', as: 'distributor' });
DistributorBrands.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

DistributorWorkingState.belongsTo(User, { foreignKey: 'distributor_id', as: 'distributor' });
User.hasMany(DistributorWorkingState, { foreignKey: 'distributor_id', as: 'workingStates' });

RetailorWorkingState.belongsTo(User, { foreignKey: 'retailor_id', as: 'retailor' });
RetailorWorkingState.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

TrayAllotment.belongsTo(User, { foreignKey: 'salesman_id', as: 'salesman' });

SalesmanTarget.belongsTo(User, { foreignKey: 'salesman_id', as: 'salesman' });

OrderDetails.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
OrderDetails.belongsTo(User, { foreignKey: 'alloted_user_id', as: 'allotedUser' });
OrderDetails.belongsTo(User, { foreignKey: 'party_id', as: 'party' });

Notification.belongsTo(User, { foreignKey: 'by_id', as: 'sender' });
Notification.belongsTo(User, { foreignKey: 'to_id', as: 'receiver' });

LoginHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User-RoleType associations
User.belongsTo(RoleType, { foreignKey: 'role_id', as: 'role' });
RoleType.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// User-Location associations
User.belongsTo(Country, { foreignKey: 'country_id', as: 'userCountry' });
User.belongsTo(State, { foreignKey: 'state_id', as: 'userState' });
User.belongsTo(Cities, { foreignKey: 'city_id', as: 'userCity' });
Country.hasMany(User, { foreignKey: 'country_id', as: 'users' });
State.hasMany(User, { foreignKey: 'state_id', as: 'users' });
Cities.hasMany(User, { foreignKey: 'city_id', as: 'users' });

// Expense associations
Expense.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Expense.belongsTo(User, { foreignKey: 'added_by_admin', as: 'admin' });

User.hasMany(Expense, { foreignKey: 'user_id', as: 'expenses' });
User.hasMany(Expense, { foreignKey: 'added_by_admin', as: 'adminExpenses' });

// Export all models
module.exports = {
  // Core models (17)
  User,
  Product,
  ProductImages,
  Brand,
  Collection,
  Shape,
  Gender,
  LensMaterial,
  LensColor,
  FrameMaterial,
  FrameColor,
  Type,
  RoleType,
  Slider,
  Country,
  State,
  Cities,
  Zone,
  
  // Expense model
  Expense,
  
  // Business models (10)
  AllotedOrders,
  DistributorBrands,
  DistributorWorkingState,
  RetailorWorkingState,
  TrayAllotment,
  SalesmanTarget,
  OrderDetails,
  Notification,
  LoginHistory
}; 