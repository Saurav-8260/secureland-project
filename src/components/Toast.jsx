import { useEffect } from "react";

function Toast({ message, show, onClose }){

  useEffect(()=>{
    if(show){
      const timer = setTimeout(()=>{
        onClose();
      },3000);

      return ()=>clearTimeout(timer);
    }
  },[show]);

  if(!show) return null;

  return(
    <div style={styles.toast}>
      🔔 {message}
    </div>
  );
}

const styles = {
  toast:{
    position:"fixed",
    top:"20px",
    right:"20px",
    background:"#111",
    color:"white",
    padding:"12px 16px",
    borderRadius:"10px",
    zIndex:9999,
    boxShadow:"0 10px 25px rgba(0,0,0,0.3)"
  }
};

export default Toast;