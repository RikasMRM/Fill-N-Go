package com.example.fill_n_go;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
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
import com.example.fill_n_go.Auth.Login;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class AfterPump extends AppCompatActivity {

    private Button submit_btn;
    private String station_id, fuel_type, pumped_amount;
    private EditText amount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_after_pump);

        Intent intent = getIntent();
        station_id = intent.getStringExtra("station_id");

        Spinner fuelTypeSpinner = findViewById(R.id.fuelTypeSpinner);
        submit_btn = findViewById(R.id.submitFuelAmountBtn);

        ArrayAdapter<CharSequence> adapter= ArrayAdapter.createFromResource(this, R.array.fuelTypes, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_item);

        fuelTypeSpinner.setAdapter(adapter);
        fuel_type = fuelTypeSpinner.getSelectedItem().toString();
        amount = findViewById(R.id.pumpedAmount);
        pumped_amount = amount.getText().toString();

        submit_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ExitUserAfterPump();
            }
        });
    }
    public void ExitUserAfterPump() {
        final HashMap<String, String> params = new HashMap<>();
        params.put("station_id", station_id);
        params.put("fuel_type", fuel_type);
        params.put("amount", pumped_amount);

        String apiKey = "https://ead-fuel-app.herokuapp.com/api/fuel-station/exit-after-pump";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        Log.e("HttpClient", "inside onResponse");
                        String msg = response.getString("message"); //access response body

                        //navigate user back to login interface
                        Toast.makeText(AfterPump.this, "Thank you!", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(AfterPump.this, Login.class);
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
                        Toast.makeText(AfterPump.this, "Couldn't update fuel amount", Toast.LENGTH_SHORT).show();
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