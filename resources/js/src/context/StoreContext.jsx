import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {api} from '../api';
const StoreContext=createContext(null);
export function StoreProvider({children}){
 const [base,setBase]=useState({categories:[],new_products:[],slides:[],info_pages:[]});
 const [cart,setCart]=useState({cart_items:[],total:0});
 const [loading,setLoading]=useState(true); const [open,setOpen]=useState(false);
 const refreshCart=()=>api.cart().then(r=>setCart(r.cart||{cart_items:[],total:0})).catch(()=>{});
 useEffect(()=>{Promise.all([api.base(),api.cart()]).then(([b,c])=>{setBase(b.data||base);setCart(c.cart||cart)}).finally(()=>setLoading(false))},[]);
 const add=async(product,qty=1,optionId=null)=>{const r=await api.add({product_id:product.id,quantity:qty,option_id:optionId});setCart(r.cart);setOpen(true)};
 const update=async(id,quantity)=>{const r=await api.update({cart_item_id:id,quantity});setCart(r.cart)};
 const remove=async(id)=>{const r=await api.remove({cart_item_id:id});setCart(r.cart)};
 const count=useMemo(()=>cart?.cart_items?.reduce((s,i)=>s+Number(i.quantity||0),0)||0,[cart]);
 return <StoreContext.Provider value={{base,cart,setCart,loading,open,setOpen,add,update,remove,refreshCart,count}}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);
