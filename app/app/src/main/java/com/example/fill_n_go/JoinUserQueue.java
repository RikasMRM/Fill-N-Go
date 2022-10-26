package com.example.fill_n_go;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ProgressBar;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class JoinUserQueue extends AppCompatActivity {
    private String station_id, station_name, user_id, vehical_type, fuel_type;
    ProgressBar progressBar;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_queue_exit);

        Intent intent = getIntent();
        station_id = intent.getStringExtra("station_id");
        user_id = intent.getStringExtra("user_id");
        fuel_type = intent.getStringExtra("fuel_type");
        vehical_type = intent.getStringExtra("vehical_type");

        //add user to the correct queue
        addToQueue();

    }
    public void addToQueue() {
        final HashMap<String, String> params = new HashMap<>();
        params.put("station_id", station_id);
        params.put("user_id", user_id);
        params.put("fuel_type", fuel_type);
        params.put("vehical_type", vehical_type);


        String apiKey = "https://ead-fuel-app.herokuapp.com/api/fuel-station/add-to-queue";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        Log.e("HttpClient", "inside onResponse");
                        String msg = response.getString("message"); //access response body
                        Toast.makeText(JoinUserQueue.this, msg, Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(JoinUserQueue.this, StationDetails.class);
                        startActivity(intent);
                    }
//                    progressBar.setVisibility(View.GONE);
                } catch (JSONException e) {
                    e.printStackTrace();
//                    progressBar.setVisibility(View.GONE);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

                NetworkResponse response = error.networkResponse;
                if (error instanceof ServerError && response != null) {
                    try {
                        String res = new String(response.data, HttpHeaderParser.parseCharset(response.headers, "utf-8"));
                        JSONObject obj = new JSONObject(res);
                        Toast.makeText(JoinUserQueue.this, "Couldn't add user to the queue", Toast.LENGTH_SHORT).show();
//                        progressBar.setVisibility(View.GONE);
                    } catch (JSONException | UnsupportedEncodingException je) {
                        je.printStackTrace();
//                        progressBar.setVisibility(View.GONE);
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
}
