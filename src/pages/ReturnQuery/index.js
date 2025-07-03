import React, { useState } from 'react';
import { NavBar, Form, DatePicker, Button, Empty, List, Tag } from 'antd-mobile';
import { SearchOutline, CloseOutline } from 'antd-mobile-icons';
import './style.css';
import '../../styles/common.css';

const ReturnQuery = () => {
  const [returnList, setReturnList] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟查询退件数据
  const handleSearch = (values) => {
    console.log('查询参数:', values);
    // 模拟API请求返回数据
    const mockData = [
      {
        id: 'RT2023112001',
        orderNo: 'OR2023101501',
        returnDate: '2023-11-20',
        status: '待处理',
        reason: '商品损坏',
        items: [
          { name: '商品A', quantity: 1, price: '¥99.00' }
        ]
      },
      {
        id: 'RT2023111501',
        orderNo: 'OR2023100801',
        returnDate: '2023-11-15',
        status: '已完成',
        reason: '商品质量问题',
        items: [
          { name: '商品B', quantity: 2, price: '¥199.00' }
        ]
      },
      {
        id: 'RT2023110501',
        orderNo: 'OR2023092201',
        returnDate: '2023-11-05',
        status: '已拒绝',
        reason: '超出退货期限',
        items: [
          { name: '商品C', quantity: 1, price: '¥299.00' }
        ]
      }
    ];
    
    setReturnList(mockData);
    setSearchVisible(false);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const resetForm = () => {
    form.resetFields();
  };

  const getStatusTag = (status) => {
    switch (status) {
      case '待处理':
        return <Tag color="#faad14">待处理</Tag>;
      case '已完成':
        return <Tag color="#52c41a">已完成</Tag>;
      case '已拒绝':
        return <Tag color="#ff4d4f">已拒绝</Tag>;
      default:
        return <Tag color="#1677ff">{status}</Tag>;
    }
  };

  return (
    <div className="return-query-container">
      <NavBar back={null} className="styled-header">退件查询</NavBar>
      
      <div className="search-bar">
        <div className="search-button" onClick={toggleSearch}>
          <SearchOutline /> 搜索
        </div>
      </div>

      {searchVisible && (
        <div className="search-form">
          <Form
            form={form}
            layout="horizontal"
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={resetForm}>重置</Button>
                <Button type="submit" color="primary" onClick={() => form.submit()}>查询</Button>
              </div>
            }
            onFinish={handleSearch}
          >
            <Form.Header>查询条件</Form.Header>
            <Form.Item name="returnId" label="退件编号">
              <input placeholder="请输入退件编号" />
            </Form.Item>
            <Form.Item name="orderNo" label="订单编号">
              <input placeholder="请输入订单编号" />
            </Form.Item>
            <Form.Item name="startDate" label="开始日期">
              <DatePicker>
                {value => value ? value.toLocaleDateString() : '请选择日期'}
              </DatePicker>
            </Form.Item>
            <Form.Item name="endDate" label="结束日期">
              <DatePicker>
                {value => value ? value.toLocaleDateString() : '请选择日期'}
              </DatePicker>
            </Form.Item>
          </Form>
          <div className="close-search" onClick={toggleSearch}>
            <CloseOutline />
          </div>
        </div>
      )}

      <div className="return-list">
        {returnList.length > 0 ? (
          returnList.map(item => (
            <div key={item.id} className="return-card">
              <div className="return-header">
                <div className="return-id">退件编号：{item.id}</div>
                <div>{getStatusTag(item.status)}</div>
              </div>
              <div className="return-info">
                <div>订单编号：{item.orderNo}</div>
                <div>退件日期：{item.returnDate}</div>
                <div>退件原因：{item.reason}</div>
              </div>
              <List header="退件商品">
                {item.items.map((product, index) => (
                  <List.Item key={index} extra={product.price}>
                    <div>{product.name}</div>
                    <div className="product-quantity">x{product.quantity}</div>
                  </List.Item>
                ))}
              </List>
            </div>
          ))
        ) : (
          <Empty
            description="暂无退件记录"
            style={{ padding: '64px 0' }}
          />
        )}
      </div>
    </div>
  );
};

export default ReturnQuery;