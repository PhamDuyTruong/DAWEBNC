import { combineReducers } from 'redux';
import hotelsReducer from './HotelsReducer';
import { placeSiteReducer, sitesReducer } from './SitesReducer';
import { hotelsFilterReducer } from './HotelsFilterReducer';
import blogsReducer from './BlogsReducer';
import detailSiteReducer from './DetailSiteReducer';
import detailBlogReducer from './DetailBlog';
import { detailHotelReducer, getRoomByHotelReducer } from './DetailHotelReducer';
import detailRoomReducer from './DetailRoomReducer';
import { loginReducer, registerReducer, logoutReducer, forgotReducer, resetReducer, activateReducer } from './AuthReducer'
import reviewReducer from './ReviewReducer';
import cartReducer from './CartReducer';
import { myOrderList, orderReducer } from './BookingReducer';
import wishlistReducer from './WishlistReducer';
import addSidebarReducer from './SidebarReducer';

import UserAdminReducer from './UserAdminReducer';
import classRoomReducer from './ClassRoomReducer';
import ClassroomAdminReducer from './ClassroomAdminReducer';
import notificationReducer from './NotificationReducer';

const rootReducer = combineReducers({
    hotels: hotelsReducer,
    sites: sitesReducer,
    getHotelsFilter: hotelsFilterReducer,
    blogs: blogsReducer,
    detailSite: detailSiteReducer,
    detailBlogs: detailBlogReducer,
    detailHotel: detailHotelReducer,
    placeSite: placeSiteReducer,
    roomAtHotel: getRoomByHotelReducer,
    detailRoom: detailRoomReducer,
    register: registerReducer,
    login: loginReducer,
    logout: logoutReducer,
    forgot: forgotReducer,
    reset: resetReducer,
    activate: activateReducer,
    review: reviewReducer,
    cart: cartReducer,
    classRoom: classRoomReducer,
    wishlist: wishlistReducer,
    sidebar: addSidebarReducer,
    order: orderReducer,
    myOrder: myOrderList,
    userAdmin: UserAdminReducer,
    classroomAdmin: ClassroomAdminReducer,
    notification: notificationReducer,
});

export default rootReducer;