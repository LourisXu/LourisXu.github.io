---
title: Android-赛龙舟小游戏
tags:
  - Android
toc: true
reward: true
translate_title: android-dragon-boat-race
date: 2018-06-29 20:09:00
---
> # 项目要求

1. 请访问[网站](http://www.kidscode.cn/archives/4385)仔细观察“端午赛龙舟”的Scratch游戏，请将该游戏改写成基于Android平台的“端午赛龙舟”游戏（图片可自行设计、选择），具体要求如下：
（1） 河堤要不停向下移动（纵向屏幕）；
（2） 可以通过能够触摸屏幕的方向控制龙舟左右移动，改变方向；手势在屏幕向右滑动，龙舟则向右移动，手势在屏幕向左滑动，龙舟则向左移动；
（3）在河面随机设置礁石、粽子，龙舟碰到礁石扣分1分，碰到粽子加分+2分；如果龙舟的分数小于0，则游戏失败，如果龙舟获得的分数超过100，游戏胜利结束。根据礁石的数量和相邻的位置设置游戏的难度等级（简单、中等、困难）。礁石的数量增加，难度增加。
（4）制作河岸两边的灌木能轻微摆动的动画；
（5）游戏可以分为单人版本，和网络多人版本。多人在线玩的时候，不同的龙舟不可以碰撞，一旦发生碰撞游戏重置；谁先得到100分谁就获胜，或者谁先得到负分，谁就失败。要求统计登录玩家的每次游戏获得的分数和参加游戏的时间；
（6）请配置游戏的背景音乐，以及龙舟碰撞礁石、粽子碰撞的音效。背景音乐和音效用户可以设置打开关闭，自行选择；
（7）请设置游戏的规则说明及帮助信息；
（8）请设置游戏的开发者信息，要求包括班级、学号、姓名

> # 项目功能介绍

## （一）登录注册

### A.功能
①跳转注册页面
②跳转登录界面
③小功能：熊猫动画
④登录或注册失败则提示
⑤远程连接超时，不进行TCP连接
⑥无网络提示，不进行TCP连接

### B.结果展示
<img src="http://pbdgqor1k.bkt.clouddn.com/login1.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/login2.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/login3.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/login4.png" width="235" height="500">
### C.关键代码

#### ①BoatGameServer（服务器端）
```java
package Server;
import Bean.User;
import Utils.SQLUtil;
import net.sf.json.JSONObject;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
/**
 * 简单的服务器的Server
 * 验证登录
 */
public class BoatGameServer {

    private static final int CONNECT_FAIL_NO_USERNAME_OR_PASSWORD=0;   //连接失败，用户名或密码错误
    private static final int CONNECT_SUCCESS=1;                        //连接成功

    public static void main(String[] args) throws Exception {
        ServerSocket serverSocket=new ServerSocket(10000);
        while(true){
            //每当服务器接收到一个客户端socket的请求时，就产生一个socket
            Socket socket=serverSocket.accept();
            new Thread(new ServerThread(socket)).start();
        }
    }

    private static class ServerThread implements Runnable{

        Socket socket;
        DataInputStream dataInputStream;
        DataOutputStream dataOutputStream;

        /**
         * 构造函数
         * @param socket
         * @throws Exception
         */
        public ServerThread(Socket socket)throws Exception{
            this.socket=socket;
            getStream();
        }

        /**
         * 获取输入流
         * @throws Exception
         */
        private void getStream()throws Exception{
            dataInputStream=new DataInputStream(socket.getInputStream());
            dataOutputStream=new DataOutputStream(socket.getOutputStream());
        }

        /**
         * 解析Json
         * @return
         * @throws IOException
         */
        private User parseJSONObject() throws IOException{

            String message=dataInputStream.readUTF();
            JSONObject jsonObject = JSONObject.fromObject(message);
            User user=(User)JSONObject.toBean(jsonObject,User.class);
            System.out.println(user.getUserName()+":"+user.getUserPassword()+":"+user.isRegister());
            return user;
        }

        /**
         * 登录
         * @param user
         */
        private void loginCheck(User user){
            try{
                boolean isExist=SQLUtil.checkUser(user.getUserName(),user.getUserPassword());
                if(isExist){
                    dataOutputStream.writeUTF(Integer.toString(CONNECT_SUCCESS));
                }else {
                    dataOutputStream.writeUTF(Integer.toString(CONNECT_FAIL_NO_USERNAME_OR_PASSWORD));
                }
            }catch (IOException e){
                e.printStackTrace();
            }
        }

        /**
         * 注册
         * @param user
         */
        private void registerCheck(User user){
            try{
                boolean isExist=SQLUtil.queryData(user.getUserName());
                if(isExist){
                    dataOutputStream.writeUTF(Integer.toString(CONNECT_FAIL_NO_USERNAME_OR_PASSWORD));
                }else {
                    if(SQLUtil.insertData(user.getUserName(),user.getUserPassword())){
                        dataOutputStream.writeUTF(Integer.toString(CONNECT_SUCCESS));
                    }else {
                        dataOutputStream.writeUTF(Integer.toString(CONNECT_FAIL_NO_USERNAME_OR_PASSWORD));
                    }
                }
            }catch (IOException e){
                e.printStackTrace();
            }
        }

        @Override
        public void run(){

            try{
                User user=parseJSONObject();
                System.out.println(user.isRegister()+":");
                if(user.isRegister()){
                    registerCheck(user);
                }else {
                    loginCheck(user);
                }
            }catch (IOException e){

            }

        }
    }
}
```
#### ②SQLUtil（数据库工具类 服务器端）
```java
package Utils;
import com.sun.org.apache.xml.internal.resolver.readers.ExtendedXMLCatalogReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
/**
 * 数据库工具类
 * 增删改查
 */
public class SQLUtil {

    private static final String dcnStr="com.mysql.jdbc.Driver";          //Driver
    private static final String urlStr="jdbc:mysql://localhost:3306/";   //Connection url
    private static String dbStr="boatgame";                              //database name
    private static String tableName="user";                              //table name
    private static final String userName="root";                         //User's Name
    private static final String userPassword="240014";                   //User's password

    /**
     * 连接数据库
     * @return
     */
    private static Statement connectDataBase(){
        try{
            Class.forName(dcnStr);
            Connection connection=DriverManager.getConnection(urlStr+dbStr+"?useSSL=false",userName,userPassword);
            return connection.createStatement();
        }catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 添加数据
     * 添加成功则返回true，反之false
     * @param userName
     * @param userPassword
     * @return
     */
    public static boolean insertData(String userName, String userPassword){
        Statement statement=connectDataBase();
        try{
            int i=statement.executeUpdate("INSERT INTO "+tableName+" VALUES('"+userName+"','"+userPassword+"')");
            if(i>0)
                return true;
        }catch (Exception e){
            e.printStackTrace();
        }

        return false;
    }

    /**
     * 删除数据
     * @param userName
     * @return
     */
    public static boolean deleteData(String userName){
        Statement statement=connectDataBase();
        try{
            int i=statement.executeUpdate("DELETE FROM "+tableName+" WHERE userName='"+userName+"'");
            if(i>0)
                return true;
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 更新数据

     * @param userName
     * @param userPassword
     * @return
     */
    public static boolean updateData(String userName, String userPassword){
        Statement statement=connectDataBase();
        if(deleteData(userName)){
           return insertData(userName,userPassword);
        }
        return false;
    }
    /**
     * 验证当前用户名、密码
     * 存在则返回true，反之false
     * @param userName          用户名
     * @param userPassword      用户密码
     * @return
     */
    public static boolean checkUser(String userName,String userPassword){
        Statement statement=connectDataBase();
        try{
            ResultSet resultSet=statement.executeQuery("SELECT * FROM "+tableName+" WHERE userName='"+userName+"'");
            while(resultSet.next()){
                System.out.println(resultSet.getString("userPassword")+"::"+userPassword);
                if(resultSet.getString("userPassword").equals(userPassword)){
                    System.out.println("success");
                    return true;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        System.out.println("failed");
        return false;
    }

    /**
     * 查询当前用户名是否存在
     * @param userName
     * @return
     */
    public static boolean queryData(String userName){
        Statement statement=connectDataBase();
        try{
            ResultSet resultSet=statement.executeQuery("SELECT * FROM "+tableName+" WHERE userName='"+userName+"'");
            while(resultSet.next()){
                if(resultSet.getString("userName").equals(userName)){
                    return true;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
```
#### ③TCPUtil（TCP连接工具类 安卓端）
```java
package utils;

import android.util.Log;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.Timer;
import java.util.TimerTask;

import static com.example.louris.BaseActivity.TAG;

/**
 * TCP连接工具类
 * 返回结果包括：
 * ①连接成功但登录或注册失败     TCPUtils.CONNECT_FAIL_ERROR_USERNAME_OR_PASSWORD
 * ②连接成功并且登录或注册成功   TCPUtils.CONNECT_SUCCESS
 * ③连接超时                    TCPUtils.CONNECT_LINK_TIMEOUT
 */
public class TCPUtils {

    private int port=10000;                         //端口号

    private String host="120.206.50.45";            //ip地址

    private Socket socket;                          //socket

    private DataInputStream inputStream;            //输入流

    private DataOutputStream outputStream;          //输出流

    public static final int CONNECT_FAIL_ERROR_USERNAME_OR_PASSWORD=0;   //连接失败，用户名或密码错误
    public static final int CONNECT_SUCCESS=1;                        //连接成功
    public static final int CONNECT_LINK_TIMEOUT=2;                   //链路连接超时

    /**
     * 实例化socket
     * 获取网络连接
     * 设置超时
     * @throws IOException
     */
    public void connect() throws IOException{

        socket=new Socket();
        socket.setSoTimeout(5000);                                       //设置读取超时时间
        SocketAddress socketAddress=new InetSocketAddress(host,port);
        socket.connect(socketAddress,3000);                     //设置链路连接超时时间

    }

    /**
     * 实例化输入输出流
     * @throws IOException
     */
    public void getStreams() throws    IOException{

        outputStream=new DataOutputStream(socket.getOutputStream());

        inputStream=new DataInputStream(socket.getInputStream());


    }

    /**
     * 接收数据
     * @return
     * @throws IOException
     */
    public String receiveData() throws IOException{

        String result=inputStream.readUTF();
        return result;

    }


    /**
     * 发送数据
     * @param message
     * @throws IOException
     */
    public void sendData(String message) throws IOException{

        outputStream.writeUTF(message);

    }


    /**
     * 关闭连接
     * 关闭输入输出流
     * 关闭scoket
     * @throws IOException
     */
    public void closeConnection() throws IOException {

        if(outputStream!=null){
            outputStream.close();
        }
        if(inputStream!=null)
        {
            inputStream.close();
        }

        if(socket.isConnected())
            socket.close();

    }

    /**
     * 连接服务器
     * @param message  发送给服务器的消息，Json格式
     * @return
     */
    public String connectToServer(String message){

        String result=String.valueOf(CONNECT_LINK_TIMEOUT);         //初始化连接超时

        Log.d(TAG,"connectToServer");
        try{

            connect();

            getStreams();

            sendData(message);

            result=receiveData();

            Log.d(TAG,result);

        }catch(IOException e){

            e.printStackTrace();

        }finally {

            try {

                closeConnection();

            }catch (IOException e){


                e.printStackTrace();

            }

        }

        return result;

    }

}
```
#### ④UserLoginTask：（异步任务进行网络连接 安卓端）
```java
/**
 * 异步任务
 * 登录或者注册
 */
public class UserLoginTask extends AsyncTask<Void, Void, Boolean> {

    private String userName;                //用户名
    private String userPassword;            //密码

    private String message;                 //网络连接消息，Json格式
    private String result="";                  //网络连接返回结果

    /**
     * 构造函数
     * @param userName          用户名
     * @param password          密码
     */
    UserLoginTask(String userName, String password) {

        this.userName=userName;
        this.userPassword=password;

        //将信息解析成Json
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userName", userName);
            jsonObject.put("userPassword", password);
            jsonObject.put("register", isRegister);
            Log.d("LogTest",isRegister+":");
            message = jsonObject.toString();
            Log.d("LogTest",message);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * 异步任务后台线程函数
     * 进行网络连接，验证登录或者注册
     * 如果是默认账号登录，直接跳过网络连接，进入游戏
     * @param params
     * @return
     */
    @Override
    protected Boolean doInBackground(Void... params) {

        if(userName.equals("admin")&&userPassword.equals("admin")){  //匹配默认非网络登录账户密码
            result=String.valueOf(TCPUtils.CONNECT_SUCCESS);
        }else {
            //网络连接
            TCPUtils tcpUtils = new TCPUtils();
            result = tcpUtils.connectToServer(message);
        }

        //TCP连接，返回结果包括：
        //①连接成功但登录或注册失败 TCPUtils.CONNECT_FAIL_NO_USERNAME_OR_PASSWORD
        //②连接成功并且登录或注册成功 TCPUtils.CONNECT_SUCCESS
        //③连接超时TCPUtils.CONNECT_LINK_TIMEOUT
        if(result==String.valueOf(TCPUtils.CONNECT_LINK_TIMEOUT)){      //连接超时
            return false;
        }else {
            return true;
        }

    }

    /**
     * 后台异步任务结束执行
     * 判断连接是否成功
     * 判断注册或者登录是否成功
     * 根据结果返回信息，跳转活动
     * @param success
     */
    @Override
    protected void onPostExecute(final Boolean success) {
        mAuthTask = null;
        showProgress(false);
        Log.d(TAG,success+":");
        if(success){    //连接成功
            if(Integer.parseInt(result)==TCPUtils.CONNECT_SUCCESS){  //登录或注册成功

                //保留当前用户信息
                BaseActivity.userName=userName;
                BaseActivity.userPassword=userPassword;

                if(isRegister){		//注册成功

                    Intent intent=new Intent(LoginActivity.this,LoginActivity.class);
                    intent.putExtra("LoginType",!isRegister);
                    startActivity(intent);
                    finish();
                }else {			//注册失败
                    Intent intentToGame = new Intent(LoginActivity.this, MenuAcitivity.class);
                    Log.d(TAG,"to game");
                    startActivity(intentToGame);
                    finish();
                }
            }else if (Integer.parseInt(result)==TCPUtils.CONNECT_FAIL_ERROR_USERNAME_OR_PASSWORD){	//连接成功，注册或登录失败
                if (isRegister){
                    Toast.makeText(LoginActivity.this, "Register failed: UserName have been registered!", Toast.LENGTH_SHORT).show();
                }else {
                    Toast.makeText(LoginActivity.this, "Login failed: UserName or password is wrong!", Toast.LENGTH_SHORT).show();
                }
            }
        }else {    //连接失败
            Toast.makeText(LoginActivity.this, "Connection failed: Remote service is not started ", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 取消任务
     */
    @Override
    protected void onCancelled() {
        mAuthTask = null;
        showProgress(false);
    }
}
```
## （二）主菜单

### A.功能
①选择游戏模式：简单、普通、困难
②设置背景音乐音量、游戏音效音量
③查看游戏说明
④查看开发者信息
⑤查看游戏记录
### B.结果展示
<img src="http://pbdgqor1k.bkt.clouddn.com/menu1.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/menu2.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/menu3.png" width="235" height="500">
## （三）游戏主界面

### A.开发思路
①绘制循环背景层
②绘制障碍和食物，维护一个List存储需要绘制的节点，如果节点移出屏幕，则从List移出
③上述开三个线程，背景更新线程，障碍生成线程和食物生成线程
④船体移动View，设置背景，并设置帧动画，主活动重写onTouchEvent方法
⑤船体闪烁线程，遭遇障碍，船体闪烁

### B.功能
①背景绘制层SurfaceView：
绘制循环背景，绘制障碍和食物
开启障碍生成线程、食物生成线程、背景更新线程
②主活动：
开启检测线程：碰撞检测、计分
开启船体移动
设置游戏模式以及相关参数
开启游戏音频
开启船体闪烁线程：遭遇障碍触发

### C.游戏说明
1.游戏分为简单、普通和困难三个模式
2.每种模式障碍和食物生成速率不同，船体移动速度不同
3.遇到障碍扣1分，捕获食物得2分，触发船体闪烁线程
4.触礁或者低于0分，则游戏失败
5.获得100分，则游戏胜利
6.船体只允许左右移动，不允许上下移动
7.食物和障碍随机生成
8.游戏记录：仅当游戏正常结束时才被记录，中途退出不做记录
9.后台切换至游戏界面即重新开始游戏，不做游戏中途保留

### D.功能展示
<img src="http://pbdgqor1k.bkt.clouddn.com/game1.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/game2.png" width="235" height="500">

### E.关键代码
#### ①BackgroundMediaService
```java
package service;

import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.util.Log;
import com.example.louris.boatgame.R;

/**
 * 背景音乐服务
 */
public class BackgroundMediaService extends Service {

    public static float leftSoundVolume;                //左声道音量
    public static float rightSoundVolume;               //右声道音量

    private MediaPlayer backgroundMediaPlayer;          //背景音乐


    /**
     * 重写onCreate
     * 获取音乐实例
     * 设置音频左右声道
     * 设置音频循环播放
     */
    @Override
    public void onCreate(){
        super.onCreate();
        Log.d("LogTest","onHandleIntent service create");
        backgroundMediaPlayer=MediaPlayer.create(BackgroundMediaService.this,R.raw.background);
        backgroundMediaPlayer.setVolume(leftSoundVolume,rightSoundVolume);
        backgroundMediaPlayer.setLooping(true);
    }

    /**
     * 重写onStartCommand
     * 播放背景音乐
     * @param intent
     * @param flags
     * @param startId
     * @return
     */
    @Override
    public int onStartCommand(Intent intent,int flags, int startId){
        if(backgroundMediaPlayer!=null&&!backgroundMediaPlayer.isPlaying()){
            backgroundMediaPlayer.start();
        }
        return super.onStartCommand(intent,flags,startId);
    }

    /**
     * 重写onBind
     * @param intent
     * @return
     */
    @Override
    public IBinder onBind(Intent intent){

        return null;
    }

    /**
     * 重写onDestroy
     * 关闭背景音乐
     */
    @Override
    public void onDestroy(){
        if(backgroundMediaPlayer!=null&&backgroundMediaPlayer.isPlaying()){
            backgroundMediaPlayer.stop();
            backgroundMediaPlayer.release();
        }
        Log.d("LogTest","onHandleIntent service");
        super.onDestroy();

    }
}
```

#### ②SingleModeActivity
```java
/**
 * 碰撞检测
 * @param X_one        障碍或食物左上角横坐标
 * @param Y_one        障碍或食物左上角纵坐标
 * @param Width_one    障碍或食物宽度
 * @param Height_one   障碍或食物高度
 * @param X_two        船体左上角横坐标
 * @param Y_two        船体左上角纵坐标
 * @param Width_two    船体宽度
 * @param Height_two   船体高度
 * @return             返回是否碰撞，碰撞则返回true，反之false
 */
private boolean isCollsion(float X_one,float Y_one,float Width_one,float Height_one,float X_two,float Y_two,float Width_two,float Height_two){
    if(       ((X_one>X_two&&X_one<X_two+Width_two)&&(Y_one>Y_two&&Y_one<Y_two+Height_two)) //第一个物体与第二个物体的右下区域重叠
            ||((X_one+Width_one>X_two&&X_one+Width_one<X_two+Width_two)&&(Y_one>Y_two&&Y_one<Y_two+Height_two)) //第一个物体与第二个物体左下区域重叠
            ||((X_one+Width_one>X_two&&X_one+Width_one<X_two+Width_two)&&(Y_one+Height_one>Y_two&&Y_one+Height_one<Y_two+Height_two)) //左上区域重叠
            ||((X_one>X_two&&X_one<X_two+Width_two)&&(Y_one+Height_one>Y_two&&Y_one+Height_one<Y_two+Height_two)) //右上区域重叠
            )
        return true;//碰撞
    return false; //未碰撞
}

/**
 * 处理碰撞
 * 获取背景层中的绘制节点列表
 * 由于多线程，list并非线程安全，
 * 故加上同步锁
 * ——当一个线程访问该list，其他线程处于阻塞状态，直至该线程操作完成
 * ——以此避免临界资源冲突问题
 * 如果发生碰撞：
 * ①遭遇障碍，船体闪烁线程启动，船体闪烁一小段时长，扣分一次，播放障碍音频
 * ②捕获食物，得分，播放食物音频
 * ③通知背景绘制层更新计分板
 * ④移出已发生碰撞的节点，以后不再绘制
 */
private void handlCollision(){
    List<Node> list=BackGroundView.list;
    synchronized (list) {  //同步锁，临界资源处理
        //遍历所有节点
        Iterator<Node> iterator=list.iterator();
        while(iterator.hasNext()){
            Node node=iterator.next();
                //发生碰撞
                if(isCollsion(node.getCurrentX(),node.getCurrentY(),node.getWidth(),node.getHeight(),boatView.getX(),boatView.getY(),boatView.getBoatWidth(),boatView.getBoatHeight())){

                    if(node.isStone()){                    //遇到障碍
                        scores+=STONE_SCORE;               //扣分
                        if(!twinkleBoatThread.isAlive()){  //船体闪烁
                            isTwinkle=true;
                            twinkleBoatThread.start();
                        }
                        startStoneMedia();                 //播放障碍音频
                    }
                    else{
                        scores+=FOOD_SCORE;                //得分
                        startFoodMedia();                  //播放食物音频
                    }
                    updateScores();                        //更新分数
                    iterator.remove();                     //移出碰撞的节点
                }
        }
    }
}



/**
 * 终止所有线程，显示结果
 * 终止实时检测线程
 * 终止船体背景绘制线程、障碍生成线程、食物生成线程
 * 禁止船体移动
 * 停止其他音频，播放相应的游戏结束音频
 * 弹框显示游戏结果
 */
private void terminateGame(){

    closeMediaPlayer();                              //关闭所有音频
    //游戏结束,显示结果
    if(scores<SCORE_WIN){
        startGameOverMedia();                       //播放游戏结束音频
        backGroundView.setGameOver(true);           //停止背景层线程
        record.setResult(TITLE_FAIL);               //记录游戏结果
    }
    else {
        startSuccessMedia();                        //播放游戏胜利音频
        record.setResult(TITLE_WIN);                //记录游戏结果
        backGroundView.setVictory(true);            //触发背景层绘制胜利图标
    }

    //避免绘制最终结果前终止线程
    try{
        Thread.sleep(30);
    }catch (Exception e) {
        e.printStackTrace();
    }
    record.setScores(scores);                        //记录游戏最终分数
    record.setEndTime(CommonDateUtil.getTime24());   //记录游戏结束时间
    record.setUserName(userName);                    //记录游戏用户名
    LitePalUtil.insertData(record);                  //插入数据

    stopTreeAnimation();                             //停止树木动画
    backGroundView.setRun(false);                    //背景停止
    boatView.stopAnimation();                        //停止船体动画
    isOver = true;                                   //游戏结束

}
/**
 * 检测线程
 * 实时检测是否发生碰撞
 * 是否达到游戏结束条件
 */
class CheckThread extends Thread implements Runnable{

    @Override
    public void run(){

        while(!isOver){
            //触礁，scores达到游戏结束条件，Game Over!
            if(boatView.getX()<=leftRiverside||boatView.getX()>=rightRiverside-boatView.getBoatWidth()||scores<SCORE_FAIL||scores>=SCORE_WIN) {
                terminateGame();                //结束游戏
                Log.d(TAG,"terminateGame");
                break;                          //直接退出循环,终止线程
            } else {
                handlCollision();               //物体下滑，处理碰撞
            }

            try{
                Thread.sleep(30);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        Log.d("LogTest","checkThread exit");
    }
}

/**
 * 船体闪烁线程
 * 船体遭遇障碍触发
 */
class TwinkleBoatThread extends Thread implements Runnable{

    //船体遇到障碍闪烁
    private int twinkle=0;                    //闪烁计数
    @Override
    public void run(){
        while(isTwinkle){
            twinkle++;                        //计数自增
            if(twinkle%2==0){                 //船体不可见
                twinkleBoat(View.INVISIBLE);
            }
            else{                             //船体可见
                twinkleBoat(View.VISIBLE);
            }
            if(twinkle==21){                  //退出闪烁线程
                twinkle=0;
                isTwinkle=false;
                twinkleBoatThread=null;
                twinkleBoatThread=new TwinkleBoatThread();  //重新初始化，以备下次开启
            }

            try{
                Thread.sleep(30);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}

/**
 * 切换主线程进行船体闪烁的UI修改
 * @param visibleFlag   View.Visible或者View.invisibile
 */
private void twinkleBoat(final int visibleFlag){
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            boatView.setVisibility(visibleFlag);
        }
    });
}

/**
 * 切换主线程通知背景层更新分数数据
 */
public void updateScores(){
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            Log.d("LogTest","scores");
            String text="分数: "+scores;
            backGroundView.setScrores(text);
        }
    });
}
```
#### ③BackgroundView

```java
/**
 * 更新两岸树木位置
 * @param list
 */
private void updateTree(final List<TreeView> list){

    GetActivityUtil.getActivityFromAppcompat(getContext()).runOnUiThread(new Runnable() {
        @Override
        public void run() {
            //更新两岸树木位置
            Iterator<TreeView> iterator = list.iterator();
            while (iterator.hasNext()) {
                final TreeView treeView = iterator.next();
                float y = treeView.getY() + backSpeed;
                if (y >= screenHeight) {
                    y = 0;
                }
                treeView.setY(y);
            }
        }
    });
}



/**
 * 更新背景数据
 */
private void updateBackground(){
    //背景更新逻辑，同一张图，用两个变量进行循环绘制
    leftTopY_One+=backSpeed;
    leftTopY_Two+=backSpeed;
    if(leftTopY_One>=screenHeight){
        leftTopY_One=leftTopY_Two-background.getHeight();
    }
    if(leftTopY_Two>=screenHeight){
        leftTopY_Two=leftTopY_One-background.getHeight();
    }

    updateTree(SingleModeActivity.leftTreeList);
    updateTree(SingleModeActivity.rightTreeList);

    //list的线程不安全，加同步锁，避免多线程访问临界资源时的冲突，临界资源即list！
    //下同
    synchronized (list){
        Iterator<Node> iterator=list.iterator();
        while(iterator.hasNext()){
            Node node=iterator.next();
            float cy=node.getCurrentY()+backSpeed;
            if(cy>=screenHeight){
                iterator.remove();
            }else{
                node.setCurrentY(cy);
            }
        }
    }


}

/**
 * 添加障碍
 */
private void addStone(){
    float currentX=leftRiverside+(float)(Math.random()*(rightRiverside-leftRiverside-70));
    float currentY=0;
    Bitmap bitmap=BitmapFactory.decodeResource(getContext().getResources(),R.drawable.stone);
    bitmap=Bitmap.createScaledBitmap(bitmap,120,120,false);
    Node stone=new Node(bitmap,currentX,currentY,true,120,120);
    synchronized (list){
        list.add(stone);
    }

}
//添加食物
private void addFood(){
    float currentX=leftRiverside+(float)(Math.random()*(rightRiverside-leftRiverside-70));
    float currentY=0;
    Bitmap bitmap=BitmapFactory.decodeResource(getContext().getResources(),R.drawable.food);
    bitmap=Bitmap.createScaledBitmap(bitmap,100,100,false);
    Node food=new Node(bitmap,currentX,currentY,false,100,100);
    synchronized (list){
        list.add(food);
    }

}
/**
 * 绘制背景以及其他物体
 */
public void drawBack(){

    Canvas canvas=holder.lockCanvas();
    Paint paint=new Paint();
    canvas.drawBitmap(background,0,leftTopY_One,paint);
    canvas.drawBitmap(background,0,leftTopY_Two,paint);

    synchronized (list){
        Iterator<Node> iterator=list.iterator();
        while(iterator.hasNext()){
            Node node=iterator.next();
            canvas.drawBitmap(node.getBitmap(),node.getCurrentX(),node.getCurrentY(),paint);
        }
    }
    paint.setColor(Color.WHITE);
    paint.setTextSize(50);

    canvas.drawText(scrores,screenWidth-200,50,paint);

    if(isVictory){
        canvas.drawBitmap(victory,0,(int)screenHeight/4,paint);
    }
    if(isGameOver){
        canvas.drawBitmap(gameover,0,(int)screenHeight/4,paint);
    }
    holder.unlockCanvasAndPost(canvas);
}
/**
 * 背景更新线程
 */
class UpdateThread extends Thread implements Runnable{

    @Override
    public void run(){
        Log.d("LogTest","run");

        while(isRun){

            updateBackground();
            drawBack();
            try{
                Thread.sleep(10);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        Log.d("LogTest"," UpdateThread exit");
    }
}

/**
 * 障碍线程
 */
class StoneThread extends Thread implements Runnable{

    @Override
    public void run(){
        //生成前的延迟
        try{
            Thread.sleep(4000);
        }catch (Exception e){
            e.printStackTrace();
        }
        Log.d(TAG,"StoneSpeed:"+stoneSpeed);
        Log.d(TAG,"stone:list size:"+BackGroundView.list.size());
        //开始循环
        while(isRun){
            sum+=stoneSpeed;
            addStone();
            try{
                Thread.sleep(stoneSpeed);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        Log.d("LogTest"," StoneThread exit");
    }
}

/**
 * 辗转相除法求最大公因数
 * @param x
 * @param y
 * @return
 */
private int gcd(int x,int y){
    x=x%y;
    if(x==0){
        return y;
    }else {
        return gcd(y,x);
    }
}

/**
 * 食物线程
 */
class FoodThread extends Thread implements Runnable{

    @Override
    public void run(){
        //生成前的延迟
        try{
            Thread.sleep(3000);
        }catch (Exception e){
            e.printStackTrace();
        }
        Log.d(TAG,"foodSpeed:"+foodSpeed);
        Log.d(TAG,"food:list size:"+BackGroundView.list.size());

        //开始循环
        while(isRun){
            sum+=foodSpeed;
            //避免食物和障碍重叠
            if(sum%(foodSpeed*stoneSpeed/gcd(foodSpeed,stoneSpeed))!=0){
                addFood();
            }
            try{
                Thread.sleep(foodSpeed);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        Log.d("LogTest"," FoodThread exit");
    }
}
```
#### ④BoatView
```java
package layout;

import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.view.View;
import android.view.ViewGroup;
import com.example.louris.boatgame.R;

/**
 * 船的View子类
 * 记录上下文
 * 记录屏幕高度、宽度
 * 记录船体当前位置横纵坐标
 * 记录船体位图
 * 记录船体高度、宽度
 * 记录船体移动标志
 * 记录船体移动速度
 */

public class BoatView extends View{

    //屏幕参数
    private float screenWidth;
    private float screenHeight;
    //船大小
    private float boatWidth=100,boatHeight=150;
    //船体移动速度
    private float speed=10;

    private AnimationDrawable animationDrawable;

    /**
     * 构造函数
     * @param context
     * @param screenWidth
     * @param screenHeight
     * @param currentX
     * @param currentY
     */
    public BoatView(Context context,float screenWidth,float screenHeight,float currentX,float currentY){
        super(context);

        this.screenWidth=screenWidth;
        this.screenHeight=screenHeight;
//设置船体位置
        this.setX(currentX);
        this.setY(currentY);

        //设置背景图
        setBackgroundResource(R.drawable.boat_animation_list);
        //设置高度宽度
        ViewGroup.LayoutParams layoutParams=new ViewGroup.LayoutParams((int)boatWidth,(int)boatHeight);
        setLayoutParams(layoutParams);
        //获取对话资源
        animationDrawable=(AnimationDrawable)getBackground();

    }

    /**
     * 开启动画
     */
    public void startAnimation(){
        if(!animationDrawable.isRunning()){
            animationDrawable.start();
        }
    }

    /**
     * 停止动画
     */
    public void stopAnimation(){
        if(animationDrawable.isRunning()){
            animationDrawable.stop();
        }
    }

     /**
     * 获取船体宽度
     * @return
     */
    public float getBoatWidth() {
        return boatWidth;
    }

    /**
     * 获取船体高度
     * @return
     */
    public float getBoatHeight() {
        return boatHeight;
    }

    /**
     * 设置船体移动速度
     * @param speed
     */
    public void setSpeed(float speed) {
        this.speed = speed;
    }

    /**
     * 获取船体移动速度
     * @return
     */
    public float getSpeed() {
        return speed;
    }
}
```

## （四）游戏记录
### A.开发逻辑
onResume中进行记录开始时间，terminateGame函数中记录结束时间并插入数据
### B.功能
记录每次完整的游戏记录
### C.功能显示

<img src="http://pbdgqor1k.bkt.clouddn.com/record1.png" width="235" height="500"><img src="http://pbdgqor1k.bkt.clouddn.com/record2.png" width="235" height="500">
### D.关键代码
#### I. 数据库配置
##### ①Litepal.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<!--
   LitePal 映射XML
   dbname 数据库名
   version 数据库版本号，方便数据库更新升级
   mapping 映射的bean类
-->
<litepal>
   <dbname value="RecordStore" ></dbname>
   <version value="1"></version>
   <list>
      <mapping class="bean.Record"></mapping>
   </list>
</litepal>
```
##### ②AndroidManifest.xml
```xml
<application
  android:name="org.litepal.LitePalApplication">
</application>
```
##### ③Gradle

compile 'org.litepal.android:core:1.3.2'

#### II. LitePalUtil（数据库工具类）
```java
package utils;

import android.util.Log;
import bean.Record;
import org.litepal.crud.DataSupport;
import org.litepal.tablemanager.Connector;

import java.util.List;

/**
 * LitePal数据库工具类
 */
public class LitePalUtil {

    /**
     * 创建数据库
     */
    public static boolean createDatabase(){
        Connector.getDatabase();
        return true;
    }

    /**
     * 添加数据
     * @param record
     */
    public static boolean insertData(Record record){
       record.save();
        Log.d("LogTest","insert");
       return true;
    }

    /**
     * 更新数据
     * 更新同一用户名的数据
     * @param record
     * @return
     */
    public static boolean updateData(Record record){
        record.updateAll("userName=?",record.getUserName());
        return true;
    }

    /**
     * 删除数据
     * 删除同一用户名的数据
     * @param record
     * @return
     */
    public static boolean deleteData(Record record){
        DataSupport.deleteAll(Record.class,"userName = ?",record.getUserName());
        return true;
    }

    /**
     * 查询数据
     * 按照用户名查询数据
     * @param record
     * @return
     */
    public static List<Record> queryData(Record record){
        List<Record> records=DataSupport.where("userName = ?",record.getUserName()).find(Record.class);
       // List<Record> records=DataSupport.findAll(Record.class);
        Log.d("LogTest","queryData");
        return records;
    }
}
```
## （五）Android端项目目录简介

App
　src
　　Main
　　　Assets
　　　　Litepal.xml   (开源库LitePal配置文件)
　　　Java
　　　　Adapter
　　　　　RecordAdapter.java   (RecyclerView适配器)
　　　　Bean
　　　　　Node.java    (障碍或食物节点类)
　　　　　Record.java   (游戏记录类)
　　　　　User.java     (用户账户类)
　　　　Com.example.louris.Boatgame
　　　　　AppEntryActivity.java       (App入口界面Activity)
　　　　　GameRecordActivity.java    (游戏记录Activity)
　　　　　LoginActivity.java           (登录Activity)
　　　　　MenuActivity.java          (游戏菜单Activity)
　　　　　SingleModeActivity.java     (单人模式游戏主界面Activity)
　　　　　BaseActivity  (Activity基类，上述所有Activity继承自此基类)
　　　　Layout
　　　　　BackgroundView.java   (背景层SurfaceView子类)
　　　　　BoatView.java         (龙舟View子类)
　　　　　TreeView.java         (树木View子类)
　　　　Service
　　　　　BackgroundMediaService.java    (背景音乐服务类)
　　　　Utils
　　　　　ActivityCollectorUtil.java         (活动收集工具类)
　　　　　CommonDateUtil.java           (Date时间格式工具类)
　　　　　GetActivityUtil.java             (Activity强制类型转换工具类)
　　　　　LitePalUtil.java                 (LitePal数据库操作工具类)
　　　　　NetworkUtil.java               (网络工具类)
　　　　　ServiceUtil.java                (服务工具类)
　　　　　TCPUtil.java                   (TCP连接工具类)
　　　Res
　　　　Drawable
　　　　　Boat1.png                    (龙舟第一帧)
　　　　　Boat2.png                    (龙舟第二帧)
　　　　　Boat3.png                    (龙舟第三帧)
　　　　　Boat_animation_list.xml        (龙舟帧动画配置)
　　　　　Btn_bg_normal.mxl            (按钮正常时样式)
　　　　　Btn_bg_pressed.xml           (按钮按下时样式)
　　　　　Entry_image.jpg               (App入口背景)
　　　　　Food.png                     (粽子图)
　　　　　Gameover.png                 (游戏失败图)
　　　　　Ic_launcher_background.xml     
　　　　　Panda1.png                   (熊猫第一帧)
　　　　　Panda2.png                   (熊猫第二帧)
　　　　　Panda3.png                   (熊猫第三帧)
　　　　　Panda4.png                   (熊猫第四帧)
　　　　　Panda5.png                   (熊猫第五帧)
　　　　　Panda_animation_list.xml       (熊猫帧动画配置)
　　　　　Record_background.jpg         (游戏记录界面背景图)
　　　　　River.png                     (河道背景图)
　　　　　Stone.png                    (障碍石头图)
　　　　　Surface.jpg                   (菜单界面背景图)
　　　　　Tree1.png                    (树木第一帧)
　　　　　Tree2.png                    (树木第二帧)
　　　　　Tree3.png                    (树木第三帧)
　　　　　Tree_animation_list.xml        (树木帧动画配置)
　　　　　Win.png                     (游戏胜利图)
　　　　Layout
　　　　　Activity_app_entry_layout.xml      (游戏入口界面活动布局)
　　　　　Activity_game_record_layout.xml    (游戏记录活动布局)
　　　　　Activity_login_layout.xml           (登录界面活动布局)
　　　　　Activity_menu_layout.xml           (游戏菜单界面活动布局)
　　　　　Activity_single_mode_layout.xml    (单人模式活动布局)
　　　　　Record_item.xml           (游戏记录RecyclerView子项布局)
　　　　Raw
　　　　　Background.mp3             (背景音乐)
　　　　　Food.mp3                   (捕获食物音频)
　　　　　Gameover.mp3               (游戏失败音频)
　　　　　Success.mp3                 (游戏胜利音频)
　　　　　Warning.mp3                (遭遇障碍音频)
　　　　Values
　　　　　Color.xml                    (颜色属性)
　　　　　Dimens.xml                  (登录样式属性)
　　　　　Strings.xml                   (字符串属性)
　　　　　Styles.xml                    (样式属性)
　　AndroidManifest.xml
　Build.gradle
## （六）服务器端项目目录简介

Src
　Bean
　　User      (用户账户类)
　Server
　　BoatGameServer   (服务程序类)
　Utils
　　SQLUtil      (SQL数据库操作工具类)
　Lib
　　Commons-beanutils-1.7.0.jar
　　Commons-collections-3.2.1.jar
　　Commons-httpclient-3.1.jar
　　Commons-lang-2.3.jar
　　Commons-logging-1.1.1.jar
　　Ezmorph-1.0.3.jar
　　Json-lib-2.4-jdk15.jar
　　Mysql-connector-java-5.1.46.jar

## （七）其他

> # 异常分析与处理

## （一）多线程访问临界资源异常
问题原因：多线程访问障碍或食物List，导致异常
解决方案：对临界资源加上同步锁，当该线程访问资源时，其他线程访问该资源时阻塞，达到多线程访问的目的
例：
```java
synchronized (list){
    Iterator<Node> iterator=list.iterator();
    while(iterator.hasNext()){
        Node node=iterator.next();
        canvas.drawBitmap(node.getBitmap(),node.getCurrentX(),node.getCurrentY(),paint);
    }
}
```
## （二）Context转Activity异常解决方案
问题原因：在View中使用Activity的内置方法时，需要根据Context获得该View所在的Activity实例，强制转换((Activity)getContext)有时会发生异常。
解决方案：编写工具类
```java
package utils;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.view.View;

/**
 * 活动工具类
 * 根据上下文返回当前活动
 */
public class GetActivityUtil {
    /**
     * 根据View返回该View的上下文所对应的活动实例
     * @param view
     * @return
     */
    public static Activity getActivity(View view){
        Context context=view.getContext();
        Activity activity=new Activity();
        if(context==null){			//判断context是否为null
            activity=null;
        }
        else if(context instanceof Activity){	//判断context是否是Activity实体
            activity=(Activity)context;
        }
        else if(context instanceof ContextWrapper){	//判断context是否是ContextWrapper实体
            activity=(Activity)((ContextWrapper) context).getBaseContext();
        }
        return activity;
    }

    /**
     * 根据上下文获得对应的活动实例
     * @param context
     * @return
     */
    public static Activity getActivityFromAppcompat(Context context){
        while (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                return (Activity) context;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        return null;
    }
}
```
## （三）游戏记录时间格式问题
问题原因：Date date=new Date（）的格式不是标准的xxxx-xx-xx xx:xx的形式
解决方案：编写转换工具类
```java
package utils;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 时间工具类
 */
public class CommonDateUtil {
    /**
     * 获取当前时间
     * @return 当前时间,24小时yyyy-MM-dd HH:mm:ss格式
     */
    public static String getTime24(){
        Date date = new Date();
        SimpleDateFormat timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = timeStamp.format(date);
        return time;
    }
}
```
## （四）获取网络状态异常
问题原因：由于登录需要网络，故需要获取网络状态，直接获取时，如果没有网络，NetworkInfo返回null，造成异常
解决方案：编写网络状态工具类
```java
/**
 * 网络工具类
 */
public class NetworkUtil {

    /**
     * 检查网络是否可用
     * @param context       上下文
     * @return              布尔值，可用true，反之false
     */
    public static boolean isNetworkAvailable(Context context){
        ConnectivityManager connectivityManager=(ConnectivityManager)(GetActivityUtil.getActivityFromAppcompat(context)).getSystemService(Context.CONNECTIVITY_SERVICE);
        if(connectivityManager!=null){
            NetworkInfo networkInfo=connectivityManager.getActiveNetworkInfo();
            if(networkInfo!=null){
                return true;  //网络可用
            }
        }
        return false;  //网络不可用
    }
}
```
## （五）障碍和食物重叠异常
问题原因：食物和障碍有时生成会有重叠
解决方案：获取食物和障碍生成的间隔时间的公倍数，避免同一时刻产生食物和障碍
```java
/**
 * 辗转相除法求最大公因数
 * @param x
 * @param y
 * @return
 */
private int gcd(int x,int y){
    x=x%y;
    if(x==0){
        return y;
    }else {
        return gcd(y,x);
    }
}

线程内：
sum+=foodSpeed;
//避免食物和障碍重叠
if(sum%(foodSpeed*stoneSpeed/gcd(foodSpeed,stoneSpeed))!=0){
    addFood();
}
```
## （六）服务器端jar包缺失异常
问题原因：服务器端数据库操作需要导入jar包，刚开始导入包不足
解决方案：
导入：
Commons-httpclient-3.1.jar
Commons-lang-2.3.jar
Commons-logging-1.1.1.jar
Ezmorph-1.0.3.jar
Json-lib-2.4-jdk15.jar
Mysql-connector-java-5.1.46.jar
Commons-collections-3.2.1.jar
Commons-beanutils-1.7.0.jar
## （七）内存溢出异常
问题原因：加载图片资源过多，或者图片资源过大
解决方案：
对加载的图片进行压缩处理，减少图片存储大小，本机不在报异常。
但是安装在其他手机中可能会出现内存溢出异常，这个未解决。
## （八）其他
### ①许可异常
记得在注册配置文件中加入相应许可。
### ②服务异常
记得在注册配置文件中注册服务。
### ③安装APK异常
异常代码：java.lang.OutOfMemoryError: Failed to allocate a 18629292 byte allocation with 4194208 free bytes and 14MB until OOM
不同手机可能运行有异常，自己的手机调试安装没有问题，自己的模拟器测试有问题，解决了，但是其他手机安装有问题，怀疑是不同手机的APK版本问题，所以考虑是适配不同版本出现的问题。而后借其他手机进行测试，发现出现了上述内存溢出的问题，本机不会，故代码健壮性还需要加强，对于内存的管理同样也要加强，暂时没有解决该问题。
### ④服务器端连接MYSQL异常
连接MYSQL时需要在url中加入?useSSL=false，新版本的MYSQL传输安全性的问题，这里不使用SSL即可。

> # 项目链接

[项目报告](http://pbdgqor1k.bkt.clouddn.com/Android_boatgame_report.pdf)[^1]
[项目源码](https://github.com/LourisXu/android-boatgame)[^2]
[^1]:项目报告：http://pbdgqor1k.bkt.clouddn.com/Android_boatgame_report.pdf
[^2]:项目源码：https://github.com/LourisXu/android-boatgame
