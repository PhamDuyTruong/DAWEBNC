import React, { useRef, useEffect } from "react";
import "./Header.css";
import { Button, Container, Row } from "reactstrap";
import { NavLink, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getShowCart } from "../../Actions/SidebarAction";
import Wishlist from "../Wishlist";
import { BiBook } from "react-icons/bi";
import logo from "../../Assets/images/Logo.jpg";
import Notifications from "react-notifications-menu";

const nav_links = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/classroom",
    display: "Classroom",
  },
  {
    path: "/news",
    display: "News",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useHistory();
  const dispatch = useDispatch();
  const { isShowCart } = useSelector((state) => state.sidebar);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  // const stickyHeaderFunction = () => {
  //   if(headerRef.current == null){
  //     return
  //   }
  //   window.addEventListener("scroll", () => {
  //     if (
  //       document.body.scrollTop > 80 ||
  //       document.documentElement.scrollTop > 80
  //     ) {
  //       headerRef.current.classList.add("sticky__header");
  //     } else {
  //       headerRef.current.classList.remove("sticky__header");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   //console.log(headerRef.current)
  //   //stickyHeaderFunction()

  //   return window.removeEventListener("scroll", stickyHeaderFunction);
  // }, []);

  const data = [];

  const toggleMenu = () => {
    menuRef.current.classList.toggle("show__menu");
  };

  const toggleCart = () => {
    const action = getShowCart(true);
    dispatch(action);
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="logo">
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "50px", height: "50px" }}
                />
              </Link>
            </div>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav_links.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <li className="nav__item" key={index}>
                        <NavLink
                          to={item.path}
                          className={(isActive) =>
                            isActive ? "active__link" : ""
                          }
                          exact={true}
                        >
                          {item.display}
                        </NavLink>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {userInfo ? (
                  <>
                    <div style={{ marginBottom: 50 }}>
                      <Notifications
                        data={data}
                        header={{
                          title: "Notifications",
                          option: {
                            text: "View All",
                            onClick: () => console.log("Clicked"),
                          },
                        }}
                        markAsRead={(data) => {
                          console.log(data);
                        }}
                      />
                    </div>

                    <div className="ml-3 cursor-pointer">
                      <Link to="/account">
                        <img
                          src={
                            userInfo.profilePic
                              ? userInfo.profilePic
                              : "https://i.pravatar.cc/150?img=56"
                          }
                          alt="avatar"
                          className="rounded-full w-[40px]"
                        />
                      </Link>
                    </div>
                    {userInfo.isAdmin ? (
                      <Button className="btn primary__btn">
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <div
                        className="mx-2 cursor-pointer relative"
                        onClick={toggleCart}
                      >
                        <BiBook size={40} />
                        <span className="absolute top-0 right-0 border w-[15px] h-[15px] bg-[#FFA41B] text-black rounded-full"></span>
                      </div>
                    )}

                    <Button className="btn primary__btn">
                      <Link to="/logout">Logout</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/sign-in">Login</Link>
                    </Button>

                    <Button className="btn primary__btn">
                      <Link to="/sign-up">Register</Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
          <Wishlist />
        </Row>
      </Container>
    </header>
  );
};

export default Header;
