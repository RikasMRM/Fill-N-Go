package com.example.fill_n_go;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Toast;

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
import com.example.fill_n_go.UtilsService.UtilService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class SearchStation extends AppCompatActivity {

    UtilService utilService;
    ProgressBar progressBar;

    private ImageButton searchBtn;
    private EditText searchText;
    private String user_id, searchInput, msg;

    @SuppressLint("MissingInflatedId")

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_station);

        Intent intent = getIntent();
        user_id = intent.getStringExtra("user_id");

        searchBtn = findViewById(R.id.searchStationBtn);
        searchText = findViewById(R.id.search_input);
        progressBar = findViewById(R.id.progress_bar);
        utilService = new UtilService();

        searchBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                utilService.hideKeyboard(view, SearchStation.this);

                searchInput = searchText.getText().toString();
                searchFuelStation(view);
            }
        });
    }

    public void searchFuelStation(View view) {
//        progressBar.setVisibility(view.VISIBLE);

        final HashMap<String, String> params = new HashMap<>();
        params.put("station_name", searchInput);

        String apiKey = "https://ead-fuel-app.herokuapp.com/api/fuel-station/search-station";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                apiKey, new JSONObject(params), new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        Log.e("HttpClient", "inside onResponse");
                        String station_id = response.getString("station_id"); //access response body
                        msg = response.getString("message");

                        Toast.makeText(SearchStation.this, msg, Toast.LENGTH_SHORT).show();

                        //navigate user to the correct main screen
                        Intent intent = new Intent(SearchStation.this, UserMain.class);
                        intent.putExtra("station_id", station_id);
                        intent.putExtra("station_name", searchInput);
                        intent.putExtra("user_id", user_id);
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
                        Toast.makeText(SearchStation.this, "Couldn't find a matching fuel station", Toast.LENGTH_SHORT).show();
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