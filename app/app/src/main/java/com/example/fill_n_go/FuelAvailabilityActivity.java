package com.example.fill_n_go;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.EditText;
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

public class FuelAvailabilityActivity extends AppCompatActivity {

    private String station_id, station_name,  petrol, diesel;
    private EditText heading, petrol_status, diesel_status;

    ProgressBar progressBar;

    @SuppressLint("MissingInflatedId")

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fuel_availability);

        Intent intent = getIntent();
        station_id = intent.getStringExtra("station_id");
        station_name = intent.getStringExtra("station_name");

        Log.e("getExtra-stationID:", station_id+""+station_name);

        progressBar = findViewById(R.id.progress_bar);
        petrol_status = findViewById(R.id.petrol_status);
        diesel_status = findViewById(R.id.dieselStatus);
        heading = findViewById(R.id.heading);

        heading.setText(station_name+"- Fuel Availability");

        displayFuelAvailability();
    }

    public void displayFuelAvailability() {
        final HashMap<String, String> params = new HashMap<>();
        params.put("station_id", station_id);

        String apiKey = "https://ead-fuel-app.herokuapp.com/api/fuel-station/fuel-availability";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        Log.e("HttpClient", "inside onResponse");
                        petrol = response.getString("dieselStatus"); //access response body
                        diesel = response.getString("petrolStatus"); //access response body

                        //set availability status according to fuel station details
                        if(petrol == "true") {
                            petrol = "Available";
                        } else {
                            petrol = "No";
                        }

                        if(diesel == "true") {
                            diesel = "Available";
                        } else {
                            diesel = "No";
                        }
                        petrol_status.setText(petrol);
                        diesel_status.setText(diesel);

                        Toast.makeText(FuelAvailabilityActivity.this, "got latest availability status", Toast.LENGTH_SHORT).show();
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
                        Toast.makeText(FuelAvailabilityActivity.this, "Couldn't fetch fuel details", Toast.LENGTH_SHORT).show();
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