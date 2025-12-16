/**
 * Next.js API Proxy Route
 * Proxies all API requests to the backend to avoid CORS issues
 */

export async function GET(request, { params }) {
  return handleRequest(request, params, 'GET');
}

export async function POST(request, { params }) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(request, { params }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(request, { params }) {
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(request, params, method) {
  try {
    // Get the API path from params
    const path = params.path ? params.path.join('/') : '';
    
    // Get the backend API URL from environment variable or use default
    // Ensure we always use the live URL from environment variable
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stallion.nishree.com/api';
    
    // Log the environment variable value for debugging
    console.log(`[Proxy] NEXT_PUBLIC_API_URL from env: ${process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}`);
    
    // Normalize the URL - remove trailing slashes
    backendUrl = backendUrl.trim().replace(/\/+$/, '');
    
    // Ensure it ends with /api
    let baseUrl = backendUrl;
    if (!baseUrl.endsWith('/api')) {
      // If it doesn't end with /api, add it
      baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
    }
    
    // Construct the full backend URL
    const backendPath = path ? `/${path}` : '';
    const url = `${baseUrl}${backendPath}`;
    
    // Log for debugging - this confirms we're using the live URL
    console.log(`[Proxy] Backend base URL: ${baseUrl}`);
    console.log(`[Proxy] Forwarding to: ${url}`);
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    // Get headers from the request
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Get request body for non-GET requests
    let body = null;
    let isFormData = false;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('multipart/form-data')) {
          // For file uploads, forward the form data
          body = await request.formData();
          isFormData = true;
        } else if (contentType && contentType.includes('application/json')) {
          body = await request.text();
        } else {
          // Try to get as text, but might be empty
          const text = await request.text();
          body = text || null;
        }
      } catch (error) {
        // If body parsing fails, continue without body
        console.warn('Failed to parse request body:', error);
        body = null;
      }
    }
    
    // Make the request to the backend
    const fetchOptions = {
      method,
    };
    
    // Set headers (but not for FormData - let fetch set it automatically)
    if (!isFormData) {
      fetchOptions.headers = headers;
    } else {
      // For FormData, only include Authorization header
      fetchOptions.headers = {};
      if (headers['Authorization']) {
        fetchOptions.headers['Authorization'] = headers['Authorization'];
      }
    }
    
    if (body) {
      fetchOptions.body = body;
      // Log the body being sent for debugging
      if (method === 'PUT' && path.includes('parties')) {
        try {
          const bodyObj = JSON.parse(body);
          console.log('[Proxy] PUT /parties body:', JSON.stringify(bodyObj, null, 2));
        } catch (e) {
          console.log('[Proxy] PUT /parties body (raw):', body);
        }
      }
    }
    
    console.log(`[Proxy] Forwarding ${method} request to: ${fullUrl}`);
    const response = await fetch(fullUrl, fetchOptions);
    
    // Get response data
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    
    let responseData;
    let responseStatus = response.status;
    
    try {
      if (isJson) {
        const text = await response.text();
        // Try to parse as JSON, fallback to text if it fails
        try {
          responseData = text ? JSON.parse(text) : null;
        } catch {
          responseData = text || null;
        }
      } else {
        responseData = await response.text();
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      responseData = { error: 'Failed to parse response', message: error.message };
      responseStatus = 500;
    }
    
    // Return response with appropriate status and headers
    return Response.json(responseData, {
      status: responseStatus,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return Response.json(
      { 
        error: error.message || 'Internal server error',
        message: 'Failed to proxy request to backend'
      },
      { status: 500 }
    );
  }
}

