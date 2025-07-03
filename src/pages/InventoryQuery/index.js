import React, { useState } from 'react';
import { Tabs, List, Input, Tag, Empty, Image, ImageViewer } from 'antd-mobile';
import { SearchOutline, RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import './index.css';
import '../../styles/common.css';

const InventoryQuery = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('realtime');
  const [searchValue, setSearchValue] = useState('');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // 实时库存数据
  const realtimeInventoryData = [
    {
      warehouse: '孟加拉仓',
      shopSku: '527051779_BD-2539814280',
      totalStock: 3,
      availableStock: 2,
      frozenStock: 1,
      defectiveStock: 0,
      sellerSku: 'QQFJB01-Manual-Yellow',
      productName: '【Must-have for Otakus】 Snail Manual Aircraft Cup for Men To Musturbate',
      productImage: 'https://static-01.daraz.com.bd/p/17f002f3ae1893b4699c5c3f980bb970.jpg',
      brand: 'No Brand'
    },
    {
      warehouse: '巴基斯坦仓',
      shopSku: '628152880_IN-3640925391',
      totalStock: 15,
      availableStock: 12,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'TECH-PHONE-CASE-001',
      productName: 'Premium Silicone Phone Case for iPhone 14 Pro Max',
      productImage: 'https://via.placeholder.com/60x60?text=Product2',
      brand: 'TechGuard'
    },
    {
      warehouse: '斯里兰卡仓',
      shopSku: '729263991_TH-4751036402',
      totalStock: 8,
      availableStock: 6,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'BEAUTY-CREAM-THAI-002',
      productName: 'Natural Coconut Oil Face Moisturizing Cream 50ml',
      productImage: 'https://via.placeholder.com/60x60?text=Product3',
      brand: 'Thai Beauty'
    },
    {
      warehouse: '中国仓',
      shopSku: '830375102_MY-5862147513',
      totalStock: 25,
      availableStock: 20,
      frozenStock: 3,
      defectiveStock: 2,
      sellerSku: 'SPORT-SHOES-RUN-003',
      productName: 'Lightweight Running Shoes for Men and Women',
      productImage: 'https://via.placeholder.com/60x60?text=Product4',
      brand: 'SportMax'
    },
    {
      warehouse: '孟加拉2仓',
      shopSku: '931486213_SG-6973258624',
      totalStock: 12,
      availableStock: 10,
      frozenStock: 2,
      defectiveStock: 0,
      sellerSku: 'ELEC-CHARGER-FAST-004',
      productName: 'Fast Charging USB-C Cable 2 Meters Length',
      productImage: 'https://via.placeholder.com/60x60?text=Product5',
      brand: 'PowerLink'
    },
    {
      warehouse: '巴基斯坦2仓',
      shopSku: '032597324_PH-7084369735',
      totalStock: 6,
      availableStock: 4,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'HOME-DECOR-LAMP-005',
      productName: 'Modern LED Table Lamp with Touch Control',
      productImage: 'https://via.placeholder.com/60x60?text=Product6',
      brand: 'LightHome'
    },
    {
      warehouse: '越南仓',
      shopSku: '133608435_VN-8195470846',
      totalStock: 18,
      availableStock: 15,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'CLOTH-TSHIRT-COTTON-006',
      productName: '100% Cotton Basic T-Shirt Unisex Multiple Colors',
      productImage: 'https://via.placeholder.com/60x60?text=Product7',
      brand: 'CottonWear'
    },
    {
      warehouse: '印尼仓',
      shopSku: '234719546_ID-9206581957',
      totalStock: 9,
      availableStock: 7,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'KITCHEN-TOOL-KNIFE-007',
      productName: 'Professional Chef Knife Set with Wooden Block',
      productImage: 'https://via.placeholder.com/60x60?text=Product8',
      brand: 'ChefMaster'
    },
    {
      warehouse: '孟加拉仓',
      shopSku: '335820657_BD-0317692068',
      totalStock: 22,
      availableStock: 18,
      frozenStock: 3,
      defectiveStock: 1,
      sellerSku: 'BABY-TOY-SOFT-008',
      productName: 'Soft Plush Baby Toy Educational Learning Set',
      productImage: 'https://via.placeholder.com/60x60?text=Product9',
      brand: 'BabyJoy'
    },
    {
      warehouse: '印度仓',
      shopSku: '436931768_IN-1428703179',
      totalStock: 14,
      availableStock: 11,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'WATCH-SMART-FITNESS-009',
      productName: 'Smart Fitness Watch with Heart Rate Monitor',
      productImage: 'https://via.placeholder.com/60x60?text=Product10',
      brand: 'FitTech'
    }
  ];

  // 即将过期库存数据
  const expiringInventoryData = [
    {
      warehouse: '孟加拉仓',
      shopSku: '527051779_BD-2539814280',
      sellerSku: 'QQFJB01-Manual-Yellow',
      productName: '【Must-have for Otakus】 Snail Manual Aircraft Cup for Men To Musturbate',
      expiryDate: '2025-02-15',
      daysToExpiry: 15,
      quantity: 2,
      productImage: 'https://via.placeholder.com/60x60?text=Product1',
      brand: 'No Brand'
    },
    {
      warehouse: '印度仓',
      shopSku: '628152880_IN-3640925391',
      sellerSku: 'TECH-PHONE-CASE-001',
      productName: 'Premium Silicone Phone Case for iPhone 14 Pro Max',
      expiryDate: '2025-02-28',
      daysToExpiry: 28,
      quantity: 5,
      productImage: 'https://via.placeholder.com/60x60?text=Product2',
      brand: 'TechGuard'
    },
    {
      warehouse: '泰国仓',
      shopSku: '729263991_TH-4751036402',
      sellerSku: 'BEAUTY-CREAM-THAI-002',
      productName: 'Natural Coconut Oil Face Moisturizing Cream 50ml',
      expiryDate: '2025-03-10',
      daysToExpiry: 38,
      quantity: 3,
      productImage: 'https://via.placeholder.com/60x60?text=Product3',
      brand: 'Thai Beauty'
    }
  ];

  // 操作记录数据
  const operationRecords = [
    {
      id: 'OP001',
      warehouse: '孟加拉仓',
      shopSku: '527051779_BD-2539814280',
      sellerSku: 'QQFJB01-Manual-Yellow',
      productName: '【Must-have for Otakus】 Snail Manual Aircraft Cup for Men To Musturbate',
      operationType: '入库',
      quantity: 5,
      operationTime: '2025-01-30 14:30:00',
      operator: '张三',
      remark: '新货入库'
    },
    {
      id: 'OP002',
      warehouse: '印度仓',
      shopSku: '628152880_IN-3640925391',
      sellerSku: 'TECH-PHONE-CASE-001',
      productName: 'Premium Silicone Phone Case for iPhone 14 Pro Max',
      operationType: '出库',
      quantity: 3,
      operationTime: '2025-01-30 10:15:00',
      operator: '李四',
      remark: '订单发货'
    },
    {
      id: 'OP003',
      warehouse: '泰国仓',
      shopSku: '729263991_TH-4751036402',
      sellerSku: 'BEAUTY-CREAM-THAI-002',
      productName: 'Natural Coconut Oil Face Moisturizing Cream 50ml',
      operationType: '库存调整',
      quantity: -2,
      operationTime: '2025-01-29 16:45:00',
      operator: '王五',
      remark: '盘点调整'
    },
    {
      id: 'OP004',
      warehouse: '马来西亚仓',
      shopSku: '830375102_MY-5862147513',
      sellerSku: 'SPORT-SHOES-RUN-003',
      productName: 'Lightweight Running Shoes for Men and Women',
      operationType: '入库',
      quantity: 10,
      operationTime: '2025-01-29 09:20:00',
      operator: '赵六',
      remark: '补货入库'
    },
    {
      id: 'OP005',
      warehouse: '新加坡仓',
      shopSku: '931486213_SG-6973258624',
      sellerSku: 'ELEC-CHARGER-FAST-004',
      productName: 'Fast Charging USB-C Cable 2 Meters Length',
      operationType: '冻结',
      quantity: 2,
      operationTime: '2025-01-28 13:10:00',
      operator: '孙七',
      remark: '质量问题冻结'
    }
  ];

  // 过滤逻辑
  const filteredRealtimeInventory = searchValue
    ? realtimeInventoryData.filter(
        (item) =>
          item.shopSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.sellerSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : realtimeInventoryData;

  const filteredExpiringInventory = searchValue
    ? expiringInventoryData.filter(
        (item) =>
          item.shopSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.sellerSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : expiringInventoryData;

  const filteredOperationRecords = searchValue
    ? operationRecords.filter(
        (item) =>
          item.shopSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.sellerSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : operationRecords;

  // 获取库存状态标签
  const getStockStatusTag = (totalStock, availableStock) => {
    if (totalStock === 0) {
      return <Tag color="#ff3141">缺货</Tag>;
    } else if (availableStock <= 5) {
      return <Tag color="#ff8f1f">低库存</Tag>;
    } else {
      return <Tag color="#00b578">正常</Tag>;
    }
  };

  // 获取过期状态标签
  const getExpiryStatusTag = (daysToExpiry) => {
    if (daysToExpiry <= 7) {
      return <Tag color="#ff3141">即将过期</Tag>;
    } else if (daysToExpiry <= 30) {
      return <Tag color="#ff8f1f">临近过期</Tag>;
    } else {
      return <Tag color="#00b578">正常</Tag>;
    }
  };

  // 获取操作类型标签
  const getOperationTypeTag = (operationType) => {
    let color = '';
    switch (operationType) {
      case '入库':
        color = '#00b578';
        break;
      case '出库':
        color = '#ff3141';
        break;
      case '库存调整':
        color = '#1677ff';
        break;
      case '冻结':
        color = '#ff8f1f';
        break;
      default:
        color = '#999';
    }
    return <Tag color={color}>{operationType}</Tag>;
  };

  // 处理图片点击
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setImageViewerVisible(true);
  };

  // 处理SKU点击，跳转到明细页面
  const handleSkuClick = (shopSku) => {
    history.push(`/merchant/inventory-query/sku-detail/${encodeURIComponent(shopSku)}`);
  };



  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>库存查询</h2>
        <div className="placeholder"></div>
      </div>

      <div className="inventory-search">
        <Input
          placeholder="搜索SKU/商品名称"
          value={searchValue}
          onChange={setSearchValue}
          clearable
          prefix={<SearchOutline />}
        />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="实时库存" key="realtime">
          {filteredRealtimeInventory.length > 0 ? (
            <List className="inventory-list">
              {filteredRealtimeInventory.map((item, index) => (
                <List.Item
                  key={index}
                  extra={<RightOutline />}
                  onClick={() => handleSkuClick(item.shopSku)}
                  arrow={false}
                >
                  <div className="inventory-item">
                    <div className="inventory-item-header">
                      <div className="inventory-item-image">
                        <Image
                          src={item.productImage}
                          width={60}
                          height={60}
                          fit="cover"
                          style={{ borderRadius: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(item.productImage);
                          }}
                        />
                      </div>
                      <div className="inventory-item-content">
                        <div className="inventory-item-title">
                          <span className="warehouse-name">{item.warehouse}</span>
                          {getStockStatusTag(item.totalStock, item.availableStock)}
                        </div>
                        <div className="shop-sku">{item.shopSku}</div>
                        <div className="seller-sku">{item.sellerSku}</div>
                        <div className="product-name">{item.productName}</div>
                        <div className="brand">品牌: {item.brand}</div>
                        <div className="stock-info">
                          <span>总库存: {item.totalStock}</span>
                          <span>可用: {item.availableStock}</span>
                          <span>冻结: {item.frozenStock}</span>
                          <span>不良品: {item.defectiveStock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Empty description="暂无库存数据" />
          )}
        </Tabs.Tab>

        <Tabs.Tab title="即将过期库存" key="expiring">
          {filteredExpiringInventory.length > 0 ? (
            <List className="inventory-list">
              {filteredExpiringInventory.map((item, index) => (
                <List.Item
                  key={index}
                  extra={<RightOutline />}
                  onClick={() => {}}
                  arrow={false}
                >
                  <div className="inventory-item">
                    <div className="inventory-item-header">
                      <div className="inventory-item-image">
                        <Image
                          src={item.productImage}
                          width={60}
                          height={60}
                          fit="cover"
                          style={{ borderRadius: '4px' }}
                          onClick={() => handleImageClick(item.productImage)}
                        />
                      </div>
                      <div className="inventory-item-content">
                        <div className="inventory-item-title">
                          <span className="warehouse-name">{item.warehouse}</span>
                          {getExpiryStatusTag(item.daysToExpiry)}
                        </div>
                        <div className="shop-sku">{item.shopSku}</div>
                        <div className="seller-sku">{item.sellerSku}</div>
                        <div className="product-name">{item.productName}</div>
                        <div className="brand">品牌: {item.brand}</div>
                        <div className="expiry-info">
                          <span>过期日期: {item.expiryDate}</span>
                          <span>剩余天数: {item.daysToExpiry}天</span>
                          <span>数量: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Empty description="暂无即将过期库存" />
          )}
        </Tabs.Tab>

        <Tabs.Tab title="操作记录" key="records">
          {filteredOperationRecords.length > 0 ? (
            <List className="inventory-list">
              {filteredOperationRecords.map((record) => (
                <List.Item
                  key={record.id}
                  extra={<RightOutline />}
                  onClick={() => {}}
                  arrow={false}
                >
                  <div className="operation-record">
                    <div className="operation-record-header">
                      <div className="operation-info">
                        <span className="warehouse-name">{record.warehouse}</span>
                        {getOperationTypeTag(record.operationType)}
                      </div>
                      <div className="operation-time">{record.operationTime}</div>
                    </div>
                    <div className="shop-sku">{record.shopSku}</div>
                    <div className="seller-sku">{record.sellerSku}</div>
                    <div className="product-name">{record.productName}</div>
                    <div className="operation-details">
                      <span>数量: {record.quantity > 0 ? '+' : ''}{record.quantity}</span>
                      <span>操作人: {record.operator}</span>
                    </div>
                    <div className="operation-remark">备注: {record.remark}</div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Empty description="暂无操作记录" />
          )}
        </Tabs.Tab>
      </Tabs>


      <ImageViewer
        image={currentImage}
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
      />
    </div>
  );
};

export default InventoryQuery;