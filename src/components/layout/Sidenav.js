

// import { useState } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import SubMenu from "antd/es/menu/SubMenu";
import {SlidersFilled, UserAddOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
    const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];
    const signup = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      key={0}
    >
      <path
        d="M0,2A2,2,0,0,1,2,0H8a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8Z"
        transform="translate(4 4)"
        fill={color}
      />
      <path
        d="M2,0A2,2,0,0,0,0,2V8a2,2,0,0,0,2,2V4A2,2,0,0,1,4,2h6A2,2,0,0,0,8,0Z"
        fill={color}
      />
    </svg>,
  ];

  const menuItemStyle = {
    marginLeft: '10px', // Adjust the left margin as needed
  };

    let rememberedUser = Cookies.get('rememberedUser');

    let NAME1 = "NO User";
    let ROLE1 = "USER";

    if (rememberedUser) {
        rememberedUser = JSON.parse(rememberedUser);
        const { USER_ID, NAME, ROLE } = rememberedUser;
        ROLE1 = ROLE;
        console.log(`User ID: ${USER_ID}, Name: ${NAME}`);
    }
    else{
        Cookies.remove('rememberedUser');
        window.location.href = '/';
    }

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Nihal Gems System</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1" style={menuItemStyle}>
          <NavLink to="/dashboard">
      <span
          className="icon"
          style={{
            background: page === "dashboard" ? color : "",
          }}
      >
        {dashboard}
      </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>

        <SubMenu
            key="2"
            title={
              <span>
        <span className="icon" style={{ background: page === "tables" ? color : "" }}>
          {tables}
        </span>
        <span className="label">Inventory</span>
      </span>
            }
        >
            <Menu.Item key="9" style={menuItemStyle}>
                <NavLink to="/add-items">
                    <span className="label">Add Item</span>
                </NavLink>
            </Menu.Item>
          <Menu.Item key="4" style={menuItemStyle}>
            <NavLink to="/rough">
              <span className="label">Rough</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="10" style={menuItemStyle}>
            <NavLink to="/lots">
              <span className="label">Lots</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="11" style={menuItemStyle}>
            <NavLink to="/sorted-lots">
              <span className="label">Sorted Lots</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="12" style={menuItemStyle}>
            <NavLink to="/c-p">
              <span className="label">Cut and Polished</span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
          <SubMenu
              key="15"
              title={
                  <span>
        <span className="icon" style={{ background: page === "tables" ? color : "" }}>
          {<SlidersFilled />}
        </span>
        <span className="label">Operations</span>
      </span>
              }
          >
              <Menu.Item key="18" style={menuItemStyle}>
                  <NavLink to="/heat-treatment-group">
                      <span className="label">Heat Treatment Group</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="30" style={menuItemStyle}>
                  <NavLink to="/heat-treatment">
                      <span className="label">Heat Treatment</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="19" style={menuItemStyle}>
                  <NavLink to="/c-and-p">
                      <span className="label">C & P</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="20" style={menuItemStyle}>
                  <NavLink to="/sort-lots">
                      <span className="label">Sort Lots</span>
                  </NavLink>
              </Menu.Item>
          </SubMenu>

          {ROLE1 === "ADMIN" ? (
          <SubMenu
              key="21"
              title={
                  <span>
        <span className="icon" style={{ background: page === "tables" ? color : "" }}>
          {billing}
        </span>
        <span className="label">Transactions</span>
      </span>
              }
          >
              <Menu.Item key="22" style={menuItemStyle}>
                  <NavLink to="/add-transation">
                      <span className="label">Add Transaction</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="27" style={menuItemStyle}>
                  <NavLink to="/add-payments">
                      <span className="label">Add Payments</span>
                  </NavLink>
              </Menu.Item>
              {/*<Menu.Item key="25" style={menuItemStyle}>*/}
              {/*    <NavLink to="/cash-dashboard">*/}
              {/*        <span className="label">Cash Dashboard</span>*/}
              {/*    </NavLink>*/}
              {/*</Menu.Item>*/}
              <Menu.Item key="31" style={menuItemStyle}>
                  <NavLink to="/cash-book">
                      <span className="label">Cash Book</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="30" style={menuItemStyle}>
                  <NavLink to="/buying">
                      <span className="label">Buying</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="31" style={menuItemStyle}>
                  <NavLink to="/selling">
                      <span className="label">Selling</span>
                  </NavLink>
              </Menu.Item>
              {/*<Menu.Item key="23" style={menuItemStyle}>*/}
              {/*    <NavLink to="/cash-flows">*/}
              {/*        <span className="label">Cash Flows</span>*/}
              {/*    </NavLink>*/}
              {/*</Menu.Item>*/}
              {/*<Menu.Item key="24" style={menuItemStyle}>*/}
              {/*    <NavLink to="/bank">*/}
              {/*        <span className="label">Bank Transactions</span>*/}
              {/*    </NavLink>*/}
              {/*</Menu.Item>*/}
              <Menu.Item key="26" style={menuItemStyle}>
                  <NavLink to="/expenses">
                      <span className="label">Expenses</span>
                  </NavLink>
              </Menu.Item>
              <Menu.Item key="28" style={menuItemStyle}>
                  <NavLink to="/invoice">
                      <span className="label">Generate Invoice</span>
                  </NavLink>
              </Menu.Item>

          </SubMenu>
                ) : null}


        <Menu.Item key="12" style={menuItemStyle}>
          <NavLink to="/customers">
      <span
          className="icon"
          style={{
            background: page === "tables" ? color : "",
          }}
      >
        {<UserAddOutlined />}
      </span>
            <span className="label">Customers</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="5">
          Account Pages
        </Menu.Item>

        <Menu.Item key="6" style={menuItemStyle}>
          <NavLink to="/profile">
      <span
          className="icon"
          style={{
            background: page === "profile" ? color : "",
          }}
      >
        {profile}
      </span>
            <span className="label">Profile</span>
          </NavLink>
        </Menu.Item>

        {/*<Menu.Item key="7" style={menuItemStyle}>*/}
        {/*  <NavLink to="/sign-in">*/}
        {/*    <span className="icon">{signin}</span>*/}
        {/*    <span className="label">Sign In</span>*/}
        {/*  </NavLink>*/}
        {/*</Menu.Item>*/}

          {ROLE1 === "ADMIN" ? (

        <Menu.Item key="8" style={menuItemStyle}>
          <NavLink to="/sign-up">
            <span className="icon">{signup}</span>
            <span className="label">Add New User</span>
          </NavLink>
        </Menu.Item>
            ) : null}

      </Menu>

    </>
  );
}

export default Sidenav;
