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
const State = require('./State');
const Cities = require('./Cities');
const Zone = require('./Zone');

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

// Cities associations
Cities.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
State.hasMany(Cities, { foreignKey: 'state_id', as: 'cities' });

// Zone associations
Zone.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Zone.belongsTo(Cities, { foreignKey: 'city_id', as: 'city' });
State.hasMany(Zone, { foreignKey: 'state_id', as: 'zones' });
Cities.hasMany(Zone, { foreignKey: 'city_id', as: 'zones' });

// Export all models
module.exports = {
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
  State,
  Cities,
  Zone
}; 