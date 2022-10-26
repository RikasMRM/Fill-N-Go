package com.example.fill_n_go;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.content.Intent;
import android.os.Build;
import android.view.WindowManager;

import com.example.fill_n_go.Auth.Login;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        }

        Thread thread = new Thread() {
            public void run() {
                try {
                    sleep(3000);
                    startActivity(new Intent(SplashActivity.this, Login.class));
                    finish();
                }catch (Exception e) {

                }
            }
        };

        thread.start();
    }
}