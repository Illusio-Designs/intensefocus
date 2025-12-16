/**
 * Next.js API Route to fetch images server-side
 * This avoids CORS issues by fetching on the server
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return Response.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Fetch the image from the URL
    // If it's a relative URL, construct the full URL
    let fetchUrl = imageUrl;
    
    // If it's a relative URL, we need to construct the full backend URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stallion.nishree.com/api';
      const baseUrl = backendUrl.endsWith('/api') 
        ? backendUrl.replace('/api', '') 
        : backendUrl.replace(/\/api\/?$/, '');
      
      // If URL starts with /api, remove it since we're adding baseUrl
      if (imageUrl.startsWith('/api')) {
        fetchUrl = `${baseUrl}${imageUrl}`;
      } else if (imageUrl.startsWith('/uploads')) {
        fetchUrl = `${baseUrl}${imageUrl}`;
      } else {
        fetchUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
    }

    // Fetch the image
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch image: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    // Get the image as a blob
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Return the image with proper headers
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
        'Content-Length': blob.size.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return Response.json(
      { error: `Failed to fetch image: ${error.message}` },
      { status: 500 }
    );
  }
}

