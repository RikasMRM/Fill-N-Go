package com.example.fill_n_go;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
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
import com.example.fill_n_go.Auth.Login;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class QueueExit extends AppCompatActivity {

    private String station_id, station_name, user_id, vehical_type, fuel_type;
    private TextView exitHeading;
    private Button exitBeforePump, exitAfterPump;

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

        //set dynamic heading at the top of the exit screen
        exitHeading = findViewById(R.id.exitHeading);
        exitHeading.setText("Are you sure you want to exit the "+vehical_type+" queue?");

        exitBeforePump = findViewById(R.id.exit_before_pump_btn);
        exitAfterPump = findViewById(R.id.exit_after_pump_btn);

        exitBeforePump.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //exit the user from the correct queue
                exitUserFromCorrectFuelQueue();

                Toast.makeText(QueueExit.this, "You Exit the queue. Thank you!", Toast.LENGTH_SHORT).show();
                //navigate user back to login interface
                Intent intent = new Intent(QueueExit.this, Login.class);
                startActivity(intent);
            }
        });

        exitAfterPump.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //exit the user from the correct queue
                exitUserFromCorrectFuelQueue();

                //navigate user to the next interface to get pumped fuel amount
                Intent intent = new Intent(QueueExit.this, AfterPump.class);
                intent.putExtra("station_id", station_id);
                startActivity(intent);
            }
        });
    }

    public void exitUserFromCorrectFuelQueue() {
        final HashMap<String, String> params = new HashMap<>();
        params.put("station_id", station_id);
        params.put("user_id", user_id);
        params.put("fuel_type", fuel_type);
        params.put("vehical_type", vehical_type);


        String apiKey = "http://localhost:4000/api/fuel-station/exit-queue";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        Log.e("HttpClient", "inside onResponse");
                        String msg = response.getString("message"); //access response body
                        Toast.makeText(QueueExit.this, msg, Toast.LENGTH_SHORT).show();
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
                        Toast.makeText(QueueExit.this, "You should be joined first before exit", Toast.LENGTH_SHORT).show();
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