<script type="text/javascript">
const serverUrl = "http://localhost:8769/user-service";
const feignServerUrl="http://localhost:8769/api-a";
function hasPermission(permission) {
      let perm=localStorage.getItem("permission");
      console.log(perm)
      console.log(permission)
      if(perm.indexOf(permission)!=-1){
        return true
      }else {
        return false;
      }
}
export default {
    serverUrl,
    feignServerUrl,
    hasPermission
}
</script>
