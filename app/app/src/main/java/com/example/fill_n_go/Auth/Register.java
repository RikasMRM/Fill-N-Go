package com.example.fill_n_go.Auth;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.ServerError;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
//import com.codewithajit.todoapp.UtilsService.SharedPreferenceClass;
//import com.codewithajit.todoapp.UtilsService.UtilService;
import com.example.fill_n_go.UtilsService.SharedPreferenceClass;
import com.example.fill_n_go.UtilsService.UtilService;

import com.example.fill_n_go.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class Register extends AppCompatActivity {
    private Button loginBtn, registerBtn;
    private EditText name_ET, email_ET, password_ET;
    ProgressBar progressBar;

    private String name, email, password, vehicalType;
    UtilService utilService;
    SharedPreferenceClass sharedPreferenceClass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        loginBtn = findViewById(R.id.loginBtn);
        name_ET = findViewById(R.id.name_ET);
        email_ET = findViewById(R.id.email_ET);
        password_ET = findViewById(R.id.password_ET);
        Spinner vehicalTypeDropdown = findViewById(R.id.vehcalTypeSpinner);
        progressBar = findViewById(R.id.progress_bar);
        registerBtn = findViewById(R.id.createUserBtn);
        utilService = new UtilService();

        ArrayAdapter<CharSequence>adapter= ArrayAdapter.createFromResource(this, R.array.vehicalTypes, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_item);

        vehicalTypeDropdown.setAdapter(adapter);

        sharedPreferenceClass = new SharedPreferenceClass(this);
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Register.this, Login.class);
                startActivity(intent);
            }
        });

        registerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                utilService.hideKeyboard(view, Register.this);
                name = name_ET.getText().toString();
                email = email_ET.getText().toString();
                password = password_ET.getText().toString();
                vehicalType = vehicalTypeDropdown.getSelectedItem().toString();
                if(validate(view)) {
                    registerUser(view);
                }
            }
        });
    }

    private void registerUser(View view) {
        progressBar.setVisibility(View.VISIBLE);

        final HashMap<String, String> params = new HashMap<>();
        params.put("email", email);
        params.put("password", password);
        params.put("name", name);
        params.put("vehicalType", vehicalType);
        params.put("type", "user");

        String apiKey = "https://ead-fuel-app.herokuapp.com/api/auth/register";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if(response.getBoolean("success")) {
                        String token = response.getString("token");
                        sharedPreferenceClass.setValue_string("token", token);
                        Toast.makeText(Register.this, "Registration successful!", Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(Register.this, Login.class));
                    }
                    progressBar.setVisibility(View.GONE);
                } catch (JSONException e) {
                    e.printStackTrace();
                    progressBar.setVisibility(View.GONE);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

                NetworkResponse response = error.networkResponse;
                if(error instanceof ServerError && response != null) {
                    try {
                        String res = new String(response.data, HttpHeaderParser.parseCharset(response.headers,  "utf-8"));

                        JSONObject obj = new JSONObject(res);
                        Toast.makeText(Register.this, obj.getString("msg"), Toast.LENGTH_SHORT).show();
                        progressBar.setVisibility(View.GONE);
                    } catch (JSONException | UnsupportedEncodingException je) {
                        je.printStackTrace();
                        progressBar.setVisibility(View.GONE);
                    }
                }
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<>();
                headers.put("Content-Type", "application/json");
                return params;
            }
        };

        // request add
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(jsonObjectRequest);
    }


    public boolean validate(View view) {
        boolean isValid;
        if(!TextUtils.isEmpty(name)) {
            if(!TextUtils.isEmpty(email)) {
                if(!TextUtils.isEmpty(password)) {
                    isValid = true;
                } else {
                    utilService.showSnackBar(view,"please enter password....");
                    isValid = false;
                }
            } else {
                utilService.showSnackBar(view,"please enter email....");
                isValid = false;
            }
        } else {
            utilService.showSnackBar(view,"please enter name....");
            isValid = false;
        }
        return  isValid;
    }

    @Override
    protected void onStart() {
        super.onStart();
        SharedPreferences todo_pref = getSharedPreferences("user_todo", MODE_PRIVATE);
        if(todo_pref.contains("token")) {
            startActivity(new Intent(Register.this, Login.class));
            finish();
        }
    }
}